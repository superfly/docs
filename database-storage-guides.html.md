---
title: Databases & Storage
layout: docs
toc: true
nav: firecracker
---



## Fly Volumes - Disk Storage

Anything an App VM writes to its root disk is ephemeral: when the VM is redeployed, the root filesystem is rebuilt using its Docker image, deleting any data written to it since it was started up. This is fine for `/tmp` files, but most apps need to keep state in a database or another form of persistent storage.

- **[Fly Volumes](/docs/reference/volumes/)** - Persistent storage on Fly.io is provided by Fly Volumes, which are slices of SSDs attached to the server your App VM runs on. You can use Volumes on an App directly, or run a separate database App with Volume storage and connect an App to that.

## Fly.io Database Projects

These are projects that we develop and support. They're not managed services; you can deploy them yourself as Fly Apps.

- **[Fly Postgres](/docs/postgres/)** - [PostgreSQL](https://www.postgresql.org/) is a popular relational database. When you deploy an App on Fly.io, we give you the option to launch a Fly Postgres App and attach it to your App. We provide tools for deployment and management; you manage the cluster once it's deployed.
- **[SQLite & LiteFS](/docs/litefs/)** - [SQLite](https://www.sqlite.org/index.html) is a very lightweight file-based database. [LiteFS](/docs/litefs/) is a distributed filesystem that transparently replicates SQLite databases. You deploy it and you manage it.

## Partner Integrations Running on Fly.io

- **[Redis by Upstash](/docs/reference/redis/)** - [Redis](https://redis.io/) is an in-memory database commonly used for caching. A managed service by [Upstash](https://upstash.com/).

## Other Storage Apps

If your application calls for a different solution, you can deploy it yourself as an App on Fly.io. These examples can help you get started with other popular storage options.

- **[MySQL and MariaDB](/docs/app-guides/mysql-on-fly/)** - [MySQL](https://www.mysql.com/) is a popular relational database. [MariaDB](https://mariadb.org/) is a community fork of MySQL and is compatible with MySQL. 

- **[EdgeDB](/docs/app-guides/edgedb/)** - [EdgeDB](https://www.edgedb.com/) is a graph-relational database that runs on top of Postgres.

- **[MinIO Object Storage](/docs/app-guides/minio/)** - [MinIO](https://min.io/) is software that allows you to self-host S3-compatible storage. 

## Recommended External Providers

If you want a fully managed database or storage solution for your Fly Apps, there are many great options, including:

- [Crunchy Bridge Managed Postgres](https://www.crunchydata.com/products/crunchy-bridge) (on AWS, Azure, GCP, or Heroku)
- [Neon Serverless Postgres](https://neon.tech/)
- [PlanetScale Serverless MySQL](https://planetscale.com/) ([guide to use with Fly Apps](docs/app-guides/planetscale/))
- [Supabase Postgres](https://supabase.com/database)
- [MinIO Hosted Object Storage](https://min.io/)

## Other Places

You can connect your Fly Apps to the usual suspects, too:

- [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/)
- [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/products/postgresql/#overview)
- [Digital Ocean Managed Postgres](https://www.digitalocean.com/products/managed-databases-postgresql)
- [Google Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres/)
- [Heroku Managed Data Services](https://www.heroku.com/managed-data-services)
- [AWS S3 Object Storage](https://aws.amazon.com/s3/)
