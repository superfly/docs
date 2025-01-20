---
title: Prisma
layout: framework_docs
blog_path: /javascript-journal
order: 4
---

[Prisma](https://www.prisma.io/) is a popular Object-Relational Mapping (ORM) library.  You can find plenty of ready to run [Fullstack examples](https://github.com/prisma/prisma-examples?tab=readme-ov-file#prisma-orm) on the Prisma site using Next.js, Nuxt, Remix and Sveltekit.

Prisma supports a [wide range of Databases](https://www.prisma.io/docs/orm/overview/databases), for deployment to Fly.io,
[PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql) and [Sqlite](https://www.prisma.io/docs/orm/overview/databases/sqlite) are recommended.  Sqlite is more convenient for development and scales well vertically.  PostgreSQL is fine
for development and scales well horizontally.  If you are not sure which to pick, start with PostgreSQL.  It is also possible to start with SQLite and convert later.

For most applications using one of these two databases, [fly launch](https://fly.io/docs/reference/fly-launch/) will pick a configuration that will get you up and running.  For more information, click on one of the following links:

* [SQLite](./sqlite)
* [PostgreSQL](./postgres)