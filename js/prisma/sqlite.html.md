---
title: Sqlite
layout: framework_docs
blog_path: /javascript-journal
order: 1
---

Most Prisma demos use [SQLite](https://www.sqlite.org/index.html), as it will get you up and running fast. As an embedded database, it will run fast in production also, some
report anywhere from [10 to 600](https://www.youtube.com/watch?v=XcAYkriuQ1o) times faster that PostgreSQL. 

Sqlite publishes a page of [appropriate uses of SQLite](https://www.sqlite.org/whentouse.html). There are few downsides to be aware of:

  * You can only have a single writer at a time on a SQLite database.  This may not be an issue from a performance perspective as dozens of small writes may still complete faster than dozens of concurrent writes using other databases.
  * You are effectively limited to a single machine.  Machines can scale quite large these days, but requests from around the world will need to make the transit and back to this machine.  [LiteFS](https://fly.io/docs/litefs/) can provide read replicas.
  * There will be momentary site unavailability when you deploy a new version.  For most applications this will be a few hundred milliseconds.

  Below is a description of the starting point that `fly launch` will provide for you.

## Dockerfile

If your application does not have a `Dockerfile`, `fly launch` will create a `Dockerfile` for you.  Determination of the
database provider and location of the database will be done by parsing your `prisma/schema.prisma` file:

```config
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

If you do have a pre-existing `Dockerfile`, the `CMD` to start your application will be overridden in your `fly.toml` in order to run a startup script (as described [below](#setup-script)).  These lines will look like:

```toml
[processes]
  app = "node dbsetup.js npm run start"
```

If at a later time you would like to replace your `Dockerfile`, you can do so by running:

```
npx dockerfile
```

See [fly-apps/dockerfile-node](https://github.com/fly-apps/dockerfile-node?tab=readme-ov-file#overview) for a list of available options.


## Volume

In order to survive restarts and deploys, your database will be placed on a [volume](https://fly.io/docs/volumes/overview/).  This is controlled by the [mounts section](https://fly.io/docs/reference/configuration/#the-mounts-section) in your `fly.toml`:

```toml
[mounts]
  source = "data"
  destination="/data"
  auto_extend_size_threshold = 80
  auto_extend_size_increment = "1GB"
  auto_extend_size_limit = "10GB"
```

Your volume will start at 1 Gigabyte and grow up to 10 Gigabytes whenever it reaches 80% of capacity.  Adjust these values as needed and run `fly deploy` to make the new values effective.

## Migrations and seeds

[prisma migrate](https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate) will be run every time your server starts, applying the migrations found in your `prisma/migrations` directory against your production database.

If a [seed command](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding) is found in your `package.json`, it will be run once, at `fly launch` time,
immediately after the first migration.

## Backing up

Because SQLite runs on a single machine, it is susceptible to host and volume failures. For this
reason [LiteStream](https://litestream.io/) is automatically configured during `fly launch` for Prisma applications that use SQLite, if you confirm that you want Tigris configured:

```
Tigris:       private bucket         (determined from app source)

? Do you want to tweak these settings before proceeding? No
```

This will cause 5 secrets to be set: 
`AWS_ACCESS_KEY_ID`,
`AWS_ENDPOINT_URL_S3`,
`AWS_REGION`,
`AWS_SECRET_ACCESS_KEY`, and
`BUCKET_NAME`

And a `litestream.yml` file to be created:

```yaml
# This is the configuration file for litestream.
#
# For more details, see: https://litestream.io/reference/config/
#
dbs:
  - path: /data/dev.db
    replicas:
      - type: s3
        endpoint: $AWS_ENDPOINT_URL_S3
        bucket: $BUCKET_NAME
        path: litestream/dev.db
        access-key-id: $AWS_ACCESS_KEY_ID
        secret-access-key: $AWS_SECRET_ACCESS_KEY
```

If we generate a `Dockerfile` for you, installation of Litestream will be included in the `Dockerfile`.  Otherwise, [@flydotio/litestream](https://www.npmjs.com/package/@flydotio/litestream) will be added to your `package.json` as a dependency.

In the event of a catastrophic failure, simply delete your machine and volume and run `fly deploy`.  Your database will be automatically restored from backup.

If you decide later you don't want LiteStream backups, delete the storage and secrets:

```
fly storage destroy
fly secrets unset AWS_ACCESS_KEY_ID AWS_ENDPOINT_URL_S3 AWS_REGION AWS_SECRET_ACCESS_KEY BUCKET_NAME
```

## Setup Script

Depending on whether or not we generate a `Dockerfile` for you, an `ENTRYPOINT` script named `docker-entrypoint.js` or a setup script named `dbsetup.js` will be created.  This script will perform the following functions:

* Create a symbolic link from your database location to the volume.  This will enable you to continue to develop and test on your local machine and still retain persistence of your database in production.
* Restore your database from LiteStream if it doesn't currently exist.
* Run database migrations
* Run your seed command if the database doesn't exist
* Run [`litestream replicate`](https://litestream.io/reference/replicate/) to to monitor & continuously replicate SQLite database.
* Launch your application

Depending on your application and what framework it uses, this script may perform other functions.

Feel free to adapt this script as needed.
