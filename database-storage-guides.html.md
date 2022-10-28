---
title: Database and Storage Guides
layout: docs
toc: true
nav: firecracker
---

Many apps need to store data. Fly.io makes it easy to deploy a [Postgres](/docs/postgres) cluster. However, applications and teams have reasons to choose other databases. This section outlines other options and helps get you started.

- **[Postgres](/docs/postgres)** - [PostgreSQL](https://www.postgresql.org/) is a popular relational database. This is the default database type offered when launching an application on Fly.io. Automated deployment and manually managed.
- **[MySQL and MariaDB](/docs/app-guides/mysql-on-fly/)** - [MySQL](https://www.mysql.com/) is a popular relational database. [MariaDB](https://mariadb.org/) is a community fork of MySQL and is compatible with MySQL. Manually deployed and manually managed.
- **[SQLite & LiteFS](/docs/litefs/)** - [SQLite](https://www.sqlite.org/index.html) is a very lightweight file based database. [LiteFS](/docs/litefs/) is a distributed filesystem that transparently replicates SQLite database. Manually deployed and manually managed.
- **[Redis](/docs/reference/redis/)** - [Redis](https://redis.io/) is an in-memory database commonly used for caching. Manually deployed and manually managed.
