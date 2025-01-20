---
title: PostgreSQL
layout: framework_docs
blog_path: /javascript-journal
order: 1
---

[PostgreSQL](https://www.postgresql.org/) is a safe choice for production. Determination of the
database provider and location of the database will be done by parsing your `prisma/schema.prisma` file:

```config
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

`fly launch` will create a [PostgreSQL database](https://fly.io/docs/postgres/) suitable for development.
For production, see our [list of recommended providers](https://fly.io/docs/postgres/getting-started/what-you-should-know/#recommended-external-providers).

<div class="note icon">Fly.io has an [upcoming managed databases product built it on top of Percona](https://community.fly.io/t/everybody-gets-containers-sidecars-and-init-containers-in-fks/23020#p-84110-why-it-matters-1) but availability dates and pricing have yet to be announced.</div>


## Dockerfile

If your application does not have a `Dockerfile`, `fly launch` will create a `Dockerfile` for you. 
If at a later time you would like to replace your `Dockerfile`, you can do so by running:

```
npx dockerfile
```

See [fly-apps/dockerfile-node](https://github.com/fly-apps/dockerfile-node?tab=readme-ov-file#overview) for a list of available options.

## Migrations and seeds

[prisma migrate](https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate) will be run on every deploy, applying the migrations found in your `prisma/migrations` directory against your production database.  The command to be run is
controlled by your [`fly.toml`](https://fly.io/docs/reference/configuration/#run-one-off-commands-before-releasing-a-deployment):

```toml
[deploy]
  release_command = 'npx prisma migrate deploy'
```

If a [seed command](https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding) is found in your `package.json`, it will be run once, at `fly launch` time,
immediately after the first migration.

## Conversion from SQLite

Converting from SQLite starts by updating your `prisma/schema.prisma` to match what you see at the top of this post.  Next, remove all your existing migrations in your `prisma/migrations` directory and recreate them:

```
rm -rf prisma/migrations
export DATABASE_URL=postgres://$USER@localhost/localdb
npx prisma migrate dev --name init
```

Remove the `[processes]` and `[mounts]` sections from the `fly.toml` and add the `[deploy]` section you see above.

Download your existing SQLite database and use [pgloader](https://pgloader.readthedocs.io/en/latest/ref/sqlite.html) to covert it to to postgres:

```bash
fly sftp get /data/dev.db
pgloader sqlite:./dev.db pgsql://$USER@localhost/localdb
```

Import the resulting database.  For Fly Postgres use [`fly postgres import`](https://fly.io/docs/flyctl/postgres-import/).

Set the `DATABASE_URL` secret using [`fly secrets set`](https://fly.io/docs/flyctl/secrets-set/).

Run `fly deploy`.

Once you are up and running, you can delete your volume using [`fly volumes destroy`](https://fly.io/docs/flyctl/volumes-destroy/).
