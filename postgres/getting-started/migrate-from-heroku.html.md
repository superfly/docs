---
title: Migrate a Postgres Database from Heroku
layout: framework_docs
order: 10
status: beta
---

This guide runs you through how to import your database from Heroku and onto Fly.io, but before that, let's go over some major differences between Heroku's managed Postgres offering and Fly.io's Postgres offering.

First and foremost, if you deploy your Postgres database to Fly.io you'll be responsible for monitoring, configuring, scaling, and tuning it. If you don't provision enough disk space, your database will run out of space and stop accepting write queries. If you don't put monitoring in place for for your database, a customer might alert you to an issue.

Fly.io ships a set of tools that makes it easier to setup Postgres database instances, connect to their console, perform Postgres version upgrades, and create and restore snapshots of the volume where Postgres data is stored.

The good news is that if you're not comfortable managing your own Postgres database, you can still deploy a Fly app that connects to your managed Heroku Postgres database.

## Provision and deploy a Postgres app to Fly

Let's create a Postgres database on Fly.io. First we run a command to provision a database.

```cmd
fly pg create --name myapp-db
```
```output
? Select Organization: Brad Gessler (personal)
? Select regions: San Jose, California (US) (sjc)
? Select configuration: Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
Creating postgres cluster myapp-db in organization personal
Creating app...
Setting secrets...
Provisioning 1 of 1 machines with image flyio/postgres-flex:15.2
Waiting for machine to start...
Machine 5683004b797d8e is created
==> Monitoring health checks
  Waiting for 5683004b797d8e to become healthy (started, 3/3)

Postgres cluster myapp-db created
  Username:    postgres
  Password:    92u0rN52VUV2SFq
  Hostname:    myapp-db .internal
  Flycast:     fdaa:0:2e26:0:1::b6
  Proxy port:  5432
  Postgres port:  5433
  Connection string: postgres://postgres:92u0rN52VUV2SFq@myapp-db.flycast:5432

Save your credentials in a secure place -- you won't be able to see them again!

Connect to postgres
Any app within the Shaun Davis organization can connect to this Postgres using the above connection string

Now that you've set up Postgres, here's what you need to understand: https://fly.io/docs/postgres/getting-started/what-you-should-know/
```

Now we have a Fly application called `myapp-db` that's running. It's important to understand that this is "just another Fly app" since we'll be passing `myapp-db` into `flyctl` for the remainder of this documentation.

## Importing your Database

<aside class="callout">
  Any new data created by your Heroku app during this database migration won't be moved over to Fly.io. Consider taking your Heroku application offline or place in read-only mode if you want to be confident that this migration will move over 100% of your Heroku data to Fly.io.
</aside>

```cmd
fly pg import $HEROKU_DATABASE_URL --app myapp-db
```
```output
? Choose a region to deploy the migration machine: San Jose, California (US) (sjc)
? Select VM size: shared-cpu-1x - 256
Waiting for machine 6e82946c0dd0e8 to start...
Connecting to fdaa:0:2e26:a7b:9ad9:3148:a144:2... complete
[info] Running pre-checks...
[info] Source Postgres version: 14.7 (Ubuntu 14.7-1.pgdg20.04+1)
[info] Target Postgres version: 15.2 (Debian 15.2-1.pgdg110+1)
[info] Pre-checks completed without issue
[info] Starting import process... (This could take a while)
[info] Import complete!
Waiting for machine 6e82946c0dd0e8 to stop...
6e82946c0dd0e8 has been destroyed
```

## Verify the import

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
