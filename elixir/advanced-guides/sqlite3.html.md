---
title: SQLite3
layout: framework_docs
objective: This guide shows you how to use SQLite3 as your database
status: beta
---

While Elixir applications on [Fly.io](https://fly.io) normally run on Postgres databases, you can
choose to run them on [SQLite3](https://www.sqlite.org/index.html). This guide will assume you have setup 
and configured Phoenix Application using [ecto_sqlite3](https://github.com/elixir-sqlite/ecto_sqlite3) running locally.

To make this work, you will need to place your databases on persistent [Volumes](https://www.sqlite.org/index.html)
as your deployment image will get overwritten the next time you deploy.

Volumes are limited to one host, this currently means that fly.io hosted Elixir applications that use
SQLite3 for their database can't be deployed to multiple regions.

But if you are okay using beta software, [LiteFS](/docs/litefs) could work for multi-region sync, check it out! But this guide is going to assume you have one node and one volume.

This guide is heavily influenced by the [guide from](https://gist.github.com/mcrumm/98059439c673be7e0484589162a54a01) Phoenix Core Team Member, Michael Crumm.

Following are the steps required to make this work:

## Create volume

```cmd
fly volumes create name
```

Replace `name` with your desired volume name.  Only alphanumeric characters and underscores are allowed in names.

Optionally, you may specify the size of the volume, in gigabytes, by adding a `--size int` argument.
The default volume size is 3 gigabytes.

## Mount and Prep for Deployment

Add the following to your `fly.toml`, once again replacing the name with what you selected, this
time in two places:

```toml
[mounts]
  source="name"
  destination="/mnt/name"
```

Next remove the release step from the `[deploy]` section of your `fly.toml` and add a DATABASE_PATH variable:

```diff
[env]
+ DATABASE_PATH = "/mnt/name/name.db"

-[deploy]
-  release_command = "/app/bin/migrate"
```

This step is required because a volume may not be ready once your application release runs, so to fix this we need to run migrations on 
application start. This can be accomplished by adding the following line to your `lib/name/application.ex:

```diff
  @impl true
  def start(_type, _args) do
+   Name.Release.migrate()
    children = [
```

## Deploy

These changes can be deployed:

```cmd
fly deploy
```

## Converting to SQLite3


Creating a new project with SQLite3 as the default is as simple as 
```shell
mix phx.new my_app --database sqlite3
```

But if you're working with existing code, here are the steps you'll need to make on a Phoenix 1.6+ application.

Append the following your `.gitignore` to ignore SQLite database files:

```.gitignore
# Database files
*.db
*.db-*
```

Replace the `:postgrex` dep from your `mix.exs` with `ecto_sqlite`.

```elixir
def deps do
  [
    {:ecto_sqlite3, "~> 0.9.1"}, # Latest version at time of publication.
    # deps..
  ]
end
```

Update the repo configuration in `config/dev.exs`:
```elixir
config :name, Name.Repo,
  database: Path.expand("../name_dev.db", Path.dirname(__ENV__.file)),
  pool_size: 5,
  show_sensitive_data_on_connection_error: true
```

Update the repo configuration in `config/test.exs`:
```elixir
config :name, Name.Repo,
  database: Path.expand("../name_test.db", Path.dirname(__ENV__.file)),
  pool_size: 5,
  pool: Ecto.Adapters.SQL.Sandbox
```

And replace the `DATABASE_URL` in `config/runtime.exs` for production:

```elixir
if config_env() == :prod do
  database_path =
    System.get_env("DATABASE_PATH") ||
      raise """
      environment variable DATABASE_PATH is missing.
      For example: /data/name/name.db
      """

  config :name, Name.Repo,
    database: database_path,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "5")
```

Finally, update your Repo to use the SQLite adapter in `lib/name/repo.ex`:

```elixir
defmodule Name.Repo do
  use Ecto.Repo,
    otp_app: :name,
    adapter: Ecto.Adapters.SQLite3
end

```

## SQLite3 Tips

### Limitations

The `ecto_sqlite3` documentation includes a [good guide](https://hexdocs.pm/ecto_sqlite3/Ecto.Adapters.SQLite3.html#module-limitations-and-caveats) on the limits of using Ecto with SQLite3. We recommend at least skimming this before putting it into production.

### Transferring Data from Postgres/MySQL to SQLite3

<aside class="callout"> 
This section is something to give you a starting point on how to get from X to SQLite. Make sure to back up your data and be vigilant, because this kind of thing is fraught at best.
</aside>

There is really no very easy way to do this since the data types between the databases are different... 

But here is one way that has worked for me in the past and might work for you! The Ruby [Sequel](https://sequel.jeremyevans.net/) project comes with a [command line tool for copying databases](https://sequel.jeremyevans.net/rdoc/files/doc/bin_sequel_rdoc.html#label-Copy+Databases).  This method *should* help when transferring between ADO, Amalgalite, IBM_DB, JDBC, MySQL, Mysql2, ODBC, Oracle, PostgreSQL, SQLAnywhere, and TinyTDS to SQLite3. That said it has limits! This is directly from the documentation:

<p class="callout">
This copies the table structure, table data, indexes, and foreign keys from the MySQL database to the PostgreSQL database.
<br />
<br />
Note that the support for copying is fairly limited. It doesn’t handle database views, functions, triggers, schemas, partial indexes, functional indexes, and many other things. Also, the data type conversion may not be exactly what you want. It is best designed for quick conversions and testing. For serious production use, use the database’s tools to copy databases for the same database type, and for different database types, use the Sequel API.
</p>

So YMMV on how useful this is for you. If you have a relatively simple database it might work great!

Install Ruby if you don't already have it on your machine.

#### macOS
```cmd
brew install ruby
```
or 

#### Ubuntu
```cmd
apt-get install ruby-full
```

The Ruby database adapter Sequel comes with a really slick command line tool for copying databases; let's install that
```sh 
gem install sequel 
```

Depending on your database, you may need to install an extra adapter. In this example we use Postgres, so let's install that:
```cmd
gem install pg
```

Next all we need to do is run the Sequel Copy command, where the first database is the source and the second database is the destination:

```cmd
sequel -C postgres://localhost/database sqlite3://name.db
```

And that's it! If you open up your SQLite database using the command line it should have your tables and data all moved over. If you get an error here about connecting you will need to figure out which ruby gem handles your adapter and install it like we did for pg. 

```cmd
sqlite3 name.db
```

#### Note on types

SQLite doesn't have official support for Postgres Arrays or Hstores, and most special datatypes! These will be copied into strings in the resulting SQLite table, so for Arrays the data will look like `{item1, item2, item3}` if you want to still use this as an array you need to use [string manipulation](https://www.sqlitetutorial.net/sqlite-replace-function/) to convert them to json and then it should work just fine. This is just one example, but the positive is that it's all just strings in SQLite, so if you can make the string look like json you are set! 

### Copying an existing database to a fly volume

If you've exported or copied your database to SQLite you will need to get your database file up to Fly.io. To do this we will use the [fly sftp](/docs/flyctl/sftp/) command. 

First open an sftp shell

```cmd
fly sftp shell
```
```output
»
```

And use the `put` command to transfer your file to the volume path.

**NOTE**: Because our server is running, we first need to give the database a new name. Do **not** try to put this file in the same place as your current `DATABASE_PATH`.

```
» put ./name.db mnt/name-prod.db
```

Check that it's there:

```sh
» ls /mnt
```
```sh
name.db
name-prod.db
.... other files
```

Then `ctrl-c` to exit.

Finally, update your env in `fly.toml`:

```diff
[env]
- DATABASE_PATH = "/mnt/name.db"
+ DATABASE_PATH = "/mnt/name-prod.db"
```

And to persist that change:
```cmd
fly deploy
```

Next time it boots it should use your new database! 
