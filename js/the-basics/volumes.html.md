---
title: Volumes
layout: framework_docs
objective: Local persistent storage for Fly machines.
order: 3
---

If your application writes configuration, session, or user data to the file system
and you want this data to persist across restarts you will need a
[fly volume](/docs/volumes/).  This doesn't apply if your
data is stored in a database elsewhere (for example in PostgreSQL, MySQL, or MongoDB),
but does apply if you are using Sqlite3.

## Creating a volume

Use [fly volumes create](https://fly.io/docs/flyctl/volumes-create/) to create a volume.
You can specify a region and a size (in gigabytes).  Create one for each machine that you will
be deploying as volumes can't be shared between machines.  You will want to use the same
volume name for each volume if these volumes will be mounted by separate instances of the
same application.

## Mounting a volume

When you created a volume, you gave it a name.  Modify your `fly.toml` to contain
a [mounts section](https://fly.io/docs/reference/configuration/#the-mounts-section)
associating that source name with a destination file path:

```toml
[mounts]
  source = "myapp_data"
  destination = "/data"
  processes= ["app"]
```

The `processes` section is optional if you only have one process defined in your toml.

## Accessing the volume

Modify your application to read and write from subdirectories of the destination path you
provided in your `fly.toml`.

In the case of Sqlite3, set the `DATABASE_URL` value to include this path.
