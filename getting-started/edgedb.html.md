---
title: EdgeDB on Fly
layout: docs
sitemap: false
nav: firecracker
---

[EdgeDB](https://www.edgedb.com) is a [graph-relational database](https://www.edgedb.com/blog/the-graph-relational-database-defined) that runs on top of Postgres and is designed as a spiritual successor to SQL. This guide explains how to perform a single-region deployment of EdgeDB with persistent storage. It will require two apps: one for Postgres and one for the EdgeDB container.

## Create the Postgres app

Create a Postgres app. You'll need to replace `mypostgres` with a unique name of your choosing.

```cmd
flyctl postgres create \
  --name mypostgres \
  --vm-size dedicated-cpu-1x \
  --volume-size 10 \
  --initial-cluster-size 1
```
```output
Automatically selected personal organization: <Your Name>
? Select region: sea (Seattle, Washington (US))
Creating postgres cluster mypostgres in organization personal
Postgres cluster mypostgres created
  Username:    postgres
  Password:    <generated passworD>
  Hostname:    mypostgres.internal
  Proxy Port:  5432
  PG Port: 5433
Save your credentials in a secure place, you won't be able to see them again! 
```

## Create the EdgeDB app

Create a directory and create a new app. Be sure to replace `myedgedb` with a custom name. When prompted, pick a region and a Fly organization.

```cmd
flyctl launch --name myedgedb --image edgedb/edgedb --no-deploy
```

Since we're using `flyctl launch`, this will create a `fly.toml`. All `flyctl` command will now be applied against our `myedgedb` application unless otherwise specified with `--app`. 

EdgeDB needs more RAM than the default `256MB` so let's scale the RAM to `1024MB`.

```cmd
flyctl scale memory 1024
```

Set a password for the EdgeDB instance as a Fly secret. Keep track of this password; it won't be visible again.

```cmd
flyctl secrets set EDGEDB_PASSWORD=mysecretpassword
```

We need to configure a few other environment variables too.

```cmd
flyctl secrets set \
  EDGEDB_SERVER_BACKEND_DSN_ENV=DATABASE_URL \
  EDGEDB_SERVER_TLS_CERT_MODE=generate_self_signed \
  EDGEDB_SERVER_PORT=8080
```

Let's discuss what's going on with all these secrets.

- `EDGEDB_SERVER_BACKEND_DSN_ENV` tells EdgeDB which environment variable holds the Postgres connection string.
- `EDGEDB_SERVER_TLS_CERT_MODE` tells EdgeDB to auto-generate a self-signed TLS certificate.
  - You may instead choose to provision a custom TLS certificate. In this case, you should instead create two other secrets: assign your certificate to `EDGEDB_SERVER_TLS_CERT` and your private key to `EDGEDB_SERVER_TLS_KEY`.
- `EDGEDB_SERVER_PORT` tells EdgeDB to listen on port `8080` instead of the default 5656, as Fly uses `8080` for its default health checks.

## Attach and deploy

Let's attach `mypostgres` to `myedgedb`.

```cmd
flyctl postgres attach mypostgres
```

This sets the value of `DATABASE_URL` in the `myedgedb` app and creates a new role called `myedgedb` in our Postgres database. By default, this role doesn't have the full set of permissions EdgeDB needs to run. To change that, open a connection to your Postgres instance.

```cmd
flyctl postgres connect --app mypostgres
```
```output
Connecting to dodopg.internal... complete
psql (14.4 (Debian 14.4-1.pgdg110+1))
Type "help" for help.

postgres=# 
```

Then run the following REPL command.

```
postgres=# alter role myedgedb createrole createdb;
ALTER ROLE
postgres=# \quit
```

Finally, our EdgeDB app is ready to deploy!

```cmd
flyctl deploy
```

It make take a few minutes to fully deploy. Debug with `flyctl logs` and check the deployment status with `flyctl status`.

```cmd
flyctl status
```

## Persist certificates

We need to persist the auto-generated TLS certificate to make sure it survives EdgeDB app restarts. (If you’ve provided your own certificate, skip this step.)

```cmd
flyctl ssh console \
  -C "edgedb-show-secrets.sh --format=toml EDGEDB_SERVER_TLS_KEY EDGEDB_SERVER_TLS_CERT" \
  | tr -d '\r' | flyctl secrets import
```

## Connection

You'll be able to connect to your EdgeDB instance using the following DSN from *other Fly.io apps* in the same organization:

`edgedb://edgedb:mysecretpassword@myedgedb.internal:8080`

To pass this DSN to another app, create a secret called `EDGEDB_DSN` containing this value. EdgeDB's client libraries will read this environment variable and connect to your instance automatically.

```cmd
flyctl secrets set \
  EDGEDB_DSN=edgedb://edgedb:mysecretpassword@myedgedb.internal:8080 \
  --app my-other-app
```

If you've [configured a Wireguard tunnel](https://fly.io/docs/reference/private-networking/) on your local machine, you'll be able to open a REPL to your new EdgeDB instance with the `edgedb` CLI.

```cmd
edgedb --dsn edgedb://edgedb:mysecretpassword@myedgedb.internal:8080 --tls-security insecure
```
```output
EdgeDB 2.x (repl 2.x.x)
Type \help for help, \quit to quit.
edgedb>
```
