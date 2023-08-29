---
title: Databases
layout: framework_docs
objective: Connecting your application to a database.
order: 2
---

Most web servers store data in a database, and there are many databases to chose from.
Examples include running [PostgreSQL](https://fly.io/docs/postgres/) on fly.io's infrastructure,
embedding [SQLite](https://www.sqlite.org/index.html) in your application, or accessing
a [MongoDB](https://www.mongodb.com/) database hosted elsewhere.

For maximum flexibility, it generally is best if your application doesn't hard code the
path to the database, but rather extracts the path from the environment.  We recommend,
and will by default automatically set, `DATABASE_URL` to this path when we either provide
or can detect the database.

For cases where an external database is used, you can set this yourself using
[`fly secrets set`](https://fly.io/docs/reference/secrets/#setting-secrets).

## Accessing the DATABASE_URL value

The way you access the `DATABASE_URL` value depends on the module or ORM you are using.

For Prisma, ensure your `prisma/schema.prisma` file contains:

```
url = env("DATABASE_URL")
```

For drizzle/sqlite3:

```
db = drizzle(new Database(new URL(process.env.DATABASE_URL).pathname));
```

For drizzle/postgres:

```
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool)
```

For knex/sqlite3:

```
  client: 'sqlite3',
  connection: { filename: new URL(process.env.DATABASE_URL).pathname },
```

For knex/pg:

```
  client: 'pg',
  connection: process.env.DATABASE_URL
```

for sqlite3:

```
const db = new sqlite3.Database(new URL(process.env.DATABASE_URL).pathname);
```

for postgres:

```
client = new pg.Client({connectionString: process.env.DATABASE_URL});
```

for mongodb:

```
const client = new mongodb.MongoClient(process.env.DATABASE_URL);
```

## SSL/TLS

If your database is hosted external to fly.io, you generally will want to connect to
it securely.  The way to do so varies by database and adapter.  An example for
postgres can be found at [node-postgres features > ssl](https://node-postgres.com/features/ssl).

Equally importantly, if your database is hosted within the
[fly.io private network](https://fly.io/docs/reference/private-networking/), you will _not_
want to connect with SSL/TLS connection options.
