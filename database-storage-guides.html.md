---
title: Database and Storage Guides
layout: docs
toc: true
nav: firecracker
---

Many apps need to store data. Fly.io makes it easy to deploy a [Postgres](/docs/postgres) cluster. However, applications and teams have reasons to choose other databases. This section outlines other options and helps get you started.

**Databases**

- **[Postgres](/docs/postgres)** - [PostgreSQL](https://www.postgresql.org/) is a popular relational database. This is the default database type offered when launching an application on Fly.io. Automated deployment and manually managed.
- **[MySQL and MariaDB](/docs/app-guides/mysql-on-fly/)** - [MySQL](https://www.mysql.com/) is a popular relational database. [MariaDB](https://mariadb.org/) is a community fork of MySQL and is compatible with MySQL. Manually deployed and manually managed.
- **[SQLite & LiteFS](/docs/litefs/)** - [SQLite](https://www.sqlite.org/index.html) is a very lightweight file based database. [LiteFS](/docs/litefs/) is a distributed filesystem that transparently replicates SQLite database. Manually deployed and manually managed.
- **[Redis](/docs/reference/redis/)** - [Redis](https://redis.io/) is an in-memory database commonly used for caching. Manually deployed and manually managed.
- **[EdgeDB](/docs/getting-started/edgedb/)** - [EdgeDB](https://www.edgedb.com/) is a graph-relational database that runs on top of Postgres. Manually deployed and manually managed.


**Data Storage**

Anything an app writes locally should be treated as ephemeral. This works fine for `/tmp` files, but nothing is persisted when a new version of the app is deployed. Any data that should persist should either be written to a database or a to another form of persistent storage.

- **[Disk Volumes](/docs/reference/volumes)** - Data written to a disk volume persists. A volume can only be attached to a single app at a time.
- **S3** - [AWS S3](https://aws.amazon.com/s3/) storage can be used with Fly.io applications.
- **[S3 Compatible Storage](/docs/app-guides/minio)** - [MinIO](https://min.io/) provides S3 compatible storage. Manually deployed and manually managed.