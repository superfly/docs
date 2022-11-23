---
title: Migrate a Postgres Database from Heroku
layout: framework_docs
order: 10
status: beta
---

This guide runs you through how to migrate a database off of Heroku and onto Fly.io, but before that, let's go over some major differences between Heroku's managed Postgres offering and Fly.io's Postgres offering.

First and foremost, if you deploy your Postgres database to Fly.io you'll be responsible for monitoring, configuring, scaling, and tuning it. If you don't provision enough disk space, your database will run out of space and stop accepting write queries. If you don't put monitoring in place for for your database, a customer might alert you to an issue.

Fly.io ships a set of tools that makes it easier to setup Postgres database instances, connect to their console, perform Postgres version upgrades, and create and restore snapshots of the volume where Postgres data is stored.

The good news is that if you're not comfortable managing your own Postgres database, you can still deploy a Fly app that connects to your managed Heroku Postgres database.

## Provision and deploy a Postgres app to Fly

Let's create a Postgres database on Fly.io. First we run a command to provision a database.

```cmd
fly pg create -n "myapp-db"
```
```output
? Select Organization: Brad Gessler (personal)
? Select regions: San Jose, California (US) (sjc)
? Select configuration: Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
Creating postgres cluster myapp-db in organization personal
Creating app...
Setting secrets...
WARN The running flyctl agent (v0.0.414) is older than the current flyctl (v0.0.420).
WARN The out-of-date agent will be shut down along with existing wireguard connections. The new agent will start automatically as needed.
Provisioning 1 of 1 machines with image flyio/postgres:14.4
Waiting for machine to start...
Machine 5683004b797d8e is created
==> Monitoring health checks
  Waiting for 5683004b797d8e to become healthy (started, 3/3)

Postgres cluster myapp-db created
  Username:    postgres
  Password:    SeKrUt
  Hostname:    myapp-db.internal
  Proxy port:  5432
  Postgres port:  5433
Save your credentials in a secure place -- you won't be able to see them again!

Connect to postgres
Any app within the Brad Gessler organization can connect to this Postgres using the following credentials:
For example: postgres://postgres:SeKrUt@myapp-db.internal:5432


Now that you've set up postgres, here's what you need to understand: https://fly.io/docs/reference/postgres-whats-next/
```
Be sure you keep the credentials in safe place, you might need them later.

Now let's set the `DATABASE_URL` environment variable on the database instance we just created so we can connect to it later to migrate the database.

```cmd
fly secrets set DATABASE_URL=postgres://postgres:SeKrUt@myapp-db.internal:5432 -a myapp-db
```

Now we have a Fly application called `myapp-db` that's running. It's important to understand that this is "just another Fly app" since we'll be passing `myapp-db` into `flyctl` for the remainder of this documentation. We also have set the location of the database that we'll be moving our Heroku data to, time to move some data!

## Transfer the Database

<aside class="callout">
  Any new data created by your Heroku app during this database migration won't be moved over to Fly.io. Consider taking your Heroku application offline or place in read-only mode if you want to be confident that this migration will move over 100% of your Heroku data to Fly.io.
</aside>

Set the `HEROKU_DATABASE_URL` variable in your Fly environment by running the following from the root of your Heroku project.

```cmd
fly secrets set HEROKU_DATABASE_URL=$(heroku config:get DATABASE_URL) -a myapp-db
```

Verify your Heroku `HEROKU_DATABASE_URL` secret is in the Fly Postgres app.

```cmd
fly secrets list -a myapp-db
```
```output
NAME                DIGEST            CREATED AT
FLY_CONSUL_URL      9566d360998cef63  7m35s ago
HEROKU_DATABASE_URL 388b2c8d45b758ae  56s ago
OPERATOR_PASSWORD   257a32c5878737d8  7m35s ago
REPL_PASSWORD       5b0a2c1ae42c9e85  7m35s ago
SU_PASSWORD         922267d3d490a184  7m35s ago
```

Alright, lets start the transfer remotely on the Fly instance.

```cmd
fly ssh console -a myapp-db
```

Then from the remote Fly SSH console we need to run a few commands.

Create the destination database.

```cmd
createdb --maintenance-db $DATABASE_URL myapp
```

Then transfer over all the data from Heroku to the database you just created.

```cmd
pg_dump -Fc --no-acl --no-owner -d $HEROKU_DATABASE_URL | pg_restore --verbose --clean --no-acl --no-owner -d $DATABASE_URL/myapp
```

You may need to upgrade your Heroku database to match the version of the source Fly database. Refer to Heroku's [Upgrading the Version of a Heroku Postgres Database](https://devcenter.heroku.com/articles/upgrading-heroku-postgres-databases) for instructions on how to upgrade, then try the command above again.

Once that's done you can exit the SSH console and unset the `HEROKU_DATABASE_URL` and `DATABASE_URL` variables.

```cmd
fly secrets unset HEROKU_DATABASE_URL DATABASE_URL -a myapp-db
```

## Verify the transfer

Then connect to your database instance and run a few queries to see if its there.

```cmd
fly pg connect -a myapp-db -d myapp
```
```output
myapp=# \dt
                     List of relations
 Schema |              Name                | Type  |  Owner
--------+----------------------------------+-------+----------
 public | [ Your tables will appear here ] | table | postgres
 public | [              ...             ] | table | postgres
 public | [ Your tables will appear here ] | table | postgres
```

## Connect it to your application

Read through [the documentation on connecting to your Postgres instances](/docs/postgres/connecting) to start accessing your data.
