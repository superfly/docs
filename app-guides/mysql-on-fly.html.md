---
title: "Use a MySQL Database"
layout: docs
sitemap: false
nav: firecracker
author: fideloper
categories:
  - mysql
  - guide
date: 2022-07-29
---

If you just want to run a quick, self-managed MySQL instance on Fly.io, here's how to do it. It's pretty basic, with one caveat around using a [Volume](/docs/reference/volumes/) to persist data.

Most Fly apps use a `Dockerfile` to define an application and its dependencies. However, in this case we can use MySQL's official container directly - no need for a custom `Dockerfile`!

Here's how to run MySQL.

## Create the App

We'll run MySQL as a new app:

```bash
# Make a directory for the mysql app
mkdir my-mysql
cd my-mysql

# Run `fly launch` to create an app
fly launch
```

You can name the app whatever you'd like. The name will become a hostname our application uses to connect to the database, such as `my-mysql.internal`.

*Don't deploy the application just yet* - we have some work to do first.

## Configure the App

Let's create a volume straight-away. If you don't create a volume, you'll lose all of your data on each deployment.

```bash
# Create a volume named "mysqldata" within our app "my-mysql"
fly volumes create mysqldata --size 10 # gb
```

We also need to set some secrets required by the [MySQL container](https://hub.docker.com/_/mysql):

```bash
# Set secrets:
# MYSQL_PASSWORD      - password set for user $MYSQL_USER
# MYSQL_ROOT_PASSWORD - password set for user "root"
fly secrets set MYSQL_PASSWORD=password MYSQL_ROOT_PASSWORD=password
```

Save these secrets somewhere, because they're not accessible after you set them.

Finally, edit the `fly.toml` file generated to look something like this:

```
app = "my-mysql"
kill_signal = "SIGINT"
kill_timeout = 5

[mounts]
  source="mysqldata"
  destination="/data"

[env]
  MYSQL_DATABASE = "cube_theory"
  MYSQL_USER = "hotdogs_are_tacos"

[build]
  image = "mysql:8"

[experimental]
  cmd = [
    "--default-authentication-plugin", 
    "mysql_native_password", 
    "--datadir", 
    "/data/mysql"
  ]
```

There's a few important things to note:

1. We deleted the `[[services]]` block and everything under it. We don't need it!
1. We added the `[build]` section to specify an existing Docker image. We don't need to create a `Dockerfile` of our own.
1. The `[env]` section contains two not-so-secret environment variables that MySQL will need to initialize itself.
1. We added the `[experimental]` section, which lets us pass a custom command (overriding Docker's `CMD`).
    1. For MySQL 8, you'll want to use the `mysql_native_password` password plugin
    1. **More importantly**, we set MySQL's data directory to a **subdirectory** of our mounted volume

<div class="callout">⚠️ Mounting a disk in Linux usually results in a `lost+found` directory being created. However, MySQL won't initialize into a data directory unless it's completely empty. Therefore, we use a subdirectory of the mounted location: `/data/mysql`.</div>


## Scale the App

There's one more detail. MySQL 8+ has higher baseline resource demands than MySQL 5.7.

If you're using MySQL 8, it's best to add some additional RAM to the VM:

```bash
# Give the vm 2GB of ram
fly scale memory 2048
```

This isn't necessary with MySQL 5.7.

If you need MySQL 8, but wish to stay in the free tier, you can also reduce MySQL 8's memory usage with additional start up flags. Edit `fly.toml` and adjust the following:

```toml
# Add the performance schema and buffer pool size flags
# Note that --performance-schema=OFF is all one string
[experimental]
  cmd = [
    "--default-authentication-plugin", "mysql_native_password",
    "--datadir", "/data/mysql",
    "--performance-schema=OFF",
    "--innodb-buffer-pool-size", "64M"
  ]
```

## Deploy the App

We're now ready to deploy the MySQL app! Go ahead and run:

```bash
fly deploy
```

After a minute of MySQL initializing itself (on its first run), you should now have an app running MySQL! 

Your other apps can access the MySQL service by its name. In my case, I would use `my-mysql.internal` as the hostname. Any app that needs to access the database should set the hostname and username as environment variables, and create a secret for the database password.

## Backups

We'll take a snapshot of the created volume every day. We retain 7 days of snapshots.

To restore a snapshot, make sure you have the latest version of the `fly` command, and pass a `--snapshot-id` flag when creating a new volume.

```bash
# Get a volume ID
fly volumes list -a my-mysql

# List snapshots for a volume
fly volumes snapshots list vol_xxx

# Create a new volume from a snapshot
fly volumes create --snapshot-id vs_xxx --size 10
```