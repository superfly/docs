---
title: SQLite3
layout: framework_docs
objective: This guide shows you how to use SQLite3 as your database
status: beta
---

While Rails applications on [fly.io](https://fly.io) normally run on Posgres databases, you can
choose to run them on [sqlite3](https://www.sqlite.org/index.html).

To make this work, you will need to place your databases on persistent [Volumes](https://www.sqlite.org/index.html)
as your deployment image will get overwritten the next time you deploy.

Volumes are limited to one host, this currently means that fly.io hosted Rails applications that use
sqlite3 for their database can't be deployed to multiple regions.
But watch this space, as things could be [changing soon](https://fly.io/blog/all-in-on-sqlite-litestream/).

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

Also in `fly.toml`, remove the following as volumes are not available at build time:

```
[deploy]
  release_command = "bundle exec rails db:migrate"
```

And a final change to `fly.toml`, replace the `SERVER_COMMAND` as follows:

```diff
 [env]
   PORT = "8080"
-  SERVER_COMMAND = "bundle exec puma"
+  SERVER_COMMAND = "bin/rails fly:init"
```

The problem here is that `SERVER_COMMAND` is normally seet up to run a single command.
There are various ways to work around this, but the most flexible way to do so is to
create either a shell script or a rake task.  Here we've opted for a rake task.

The rake task can be created by placing the following in `lib/tasks/fly.rake`:

```ruby
namespace :fly do
  task :init => 'db:migrate' do
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


