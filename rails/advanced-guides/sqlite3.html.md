---
title: SQLite3
layout: framework_docs
objective: This guide shows you how to use SQLite3 as your database
status: beta
---

While Rails applications on [Fly.io](https://fly.io) normally run on Postgres databases, you can
choose to run them on [sqlite3](https://www.sqlite.org/index.html).

To make this work, you will need to place your databases on persistent [Volumes](https://www.sqlite.org/index.html)
as your deployment image will get overwritten the next time you deploy.

Volumes are limited to one host, this currently means that fly.io hosted Rails applications that use
sqlite3 for their database can't be deployed to multiple regions.

But if you are okay using beta software, [LiteFS](/docs/litefs) could work for multi-region sync, check it out! But this guide assumes you have one node and one volume.

Following are the steps required to make this work:

## Create volume

```cmd
fly volumes create name
```

Replace `name` with your desired volume name.  Only alphanumeric characters and
underscores are allowed in names.

Optionally, you may specify the size of the volume, in gigabytes, by adding a `--size int` argument.
The default volume size is 3 gigabytes.

Now set the following secret, again replacing the name with what you selected:

```cmd
fly secrets set DATABASE_URL=sqlite3:///mnt/name/production.sqlite
```

## Mount and Prep for Deployment

Add the following to your `fly.toml`, once again replacing the name with what you selected, this
time in two places:

```
[mounts]
  source="name"
  destination="/mnt/name"
```

Next move the dependency on the `db:migrate` task from the `release` to `server` in `lib/tasks/fly.rake`:

```diff
 # commands used to deploy a Rails application
 namespace :fly do
   # BUILD step:
   #  - changes to the filesystem made here DO get deployed
   #  - NO access to secrets, volumes, databases
   #  - Failures here prevent deployment
   task :build => 'assets:precompile'
 
   # RELEASE step:
   #  - changes to the filesystem made here are DISCARDED
   #  - full access to secrets, databases
   #  - failures here prevent deployment
-  task :release => 'db:migrate'
+  task :release
 
   # SERVER step:
   #  - changes to the filesystem made here are deployed
   #  - full access to secrets, databases
   #  - failures here result in VM being stated, shutdown, and rolled back
   #    to last successful deploy (if any).
-  task :server do
+  task :server => 'db:migrate' do
     sh 'bin/rails server'
   end
 end
```

You can also silence warnings about running sqlite3 in production by adding the following line to
config/environments/production.rb:

```diff
 Rails.application.configure do
+  config.active_record.sqlite3_production_warning=false
```

## Deploy

These changes can be deployed using `fly deploy`.


