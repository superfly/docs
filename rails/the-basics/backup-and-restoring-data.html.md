---
title: Backup and Restore Data
layout: framework_docs
objective: Provision Postgres database clusters with Fly for your Rails application and learn how to create backups from daily snapshots and restore them to a new database.
order: 5
---

The most important part of running any Rails application is making sure your data is backed up and safe, and if the unspeakable happens, it's straightforward to restore data and get back up and running.

Postgres databases on Fly are treated as Fly.io apps, which you can [read more about in the docs](/source/docs/reference/postgres). What that means is backing up data is an exercise in taking snapshots of the Postgres app's volumes, then restoring the snapshots to a new database server, verifying the restoration, and connecting the application to the restored database.

## Get the name of the database app instance

If you set up your Rails application from `fly launch`, the name of your database is `<app-name>-db`. To figure that out for sure run the following from the root of the Rails project:

```cmd
fly info
```
```output
App
  Name     = my-rails-app
  Owner    = personal
  Version  = 40
  Status   = running
  Hostname = my-rails-app.fly.dev
```

The `Name` key is the name of your Rails app. In this case, the database app would be `my-rails-app-db`. Let's see if that instance exists by appending the `-a` flag with the name of the database application:

```cmd
fly info -a my-rails-app-db
```
```output
App
  Name     = my-rails-app-db
  Owner    = personal
  Version  = 40
  Status   = running
  Hostname = my-rails-app-db.fly.dev
```

If that doesn't work, then try to find the database instance by running:

```cmd
fly postgres list
```
```output
NAME                       OWNER    STATUS  LATEST DEPLOY
my-rails-app-db       personal running 37m11s ago
```

and look for the database instance under the `NAME` column on the list.

## Daily Backup snapshots

Fly creates a snapshot of the database volumes once per day and retains them for 7 days. To view the snapshots for the database run:

```cmd
fly volumes list -a my-rails-app-db
```
```output
ID                    STATE   NAME    SIZE  REGION  ZONE  ATTACHED VM CREATED AT
vol_18l524ywo6pr7ztz  created pg_data 10GB  ord     9899  4d0f9e75    1 week ago
vol_okgj5456mqxry2wz  created pg_data 10GB  ord     d6bf  015ff37c    1 week ago
```

The number of volumes will vary depending on how many database replicas you elected while provisioning the database. One primary database and one replica will yield 2 volumes.

Now, let's see how many snapshots exist for a database volume:

```cmd
fly volumes snapshots list vol_18l524ywo6pr7ztz
```
```output
Snapshots
ID                      SIZE      CREATED AT
vs_nRabzvyYJoRgqfMjM8   84202094  56 minutes ago
vs_wkptzNyLBQklDC6eGLv  84367861  1 day ago
vs_L4MbJeny9Q4Ogt97b1y  84238497  2 days ago
vs_bebpAmaz9we0Mug7eP   83702010  3 days ago
```

The values under the `ID` columns are what will be used to restore a snapshot.

## Restoring Daily Snapshot

To restore a Postgres application from a snapshot, simply specify the `--snapshot-id` argument when running the `create` command as shown below:

```cmd
fly postgres create --snapshot-id <snapshot-id>
```
```output
? App Name: my-rails-app-db-restored
Automatically selected personal organization: Brad Gessler
? Select region:  [Use arrows to move, type to filter]
? Select region: sjc (San Jose, California (US))
? Specify the initial cluster size: 2
? Select VM size: shared-cpu-1x - 256
Creating postgres cluster my-rails-app-db-restored in organization personal
Postgres cluster my-rails-app-db-restored created
  Username:    postgres
  Password:    <redacted>
  Hostname:    my-rails-app-db-restored.internal
  Proxy Port:  5432
  PG Port: 5433
Save your credentials in a secure place, you won't be able to see them again!
```

This provisions and launches a new Fly database server with the snapshot you specified.

## Connect the Restored Database

Detach the Rails application from the current Postgres cluster:

```cmd
fly postgres detach --postgres-app my-rails-app-db
```

Then attach it to the new cluster:

```cmd
fly postgres attach --postgres-app my-rails-app-db-restored
```

Now your application is pointing at the restored database.
