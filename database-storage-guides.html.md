---
title: Databases & Storage
layout: docs
toc: true
nav: firecracker
redirect_from: /docs/app-guides/planetscale
---

## Choosing an approach to storage

Often the solution to persistent data storage is to connect your Fly App to a separate database or object store.

Fly.io offers a [deploy-it-yourself Postgres app](/docs/postgres/) with some tools to make it easier to manage yourself.

If you need hardware-local disk storage on your Machines&mdash;for example, if your Fly App _is_ a database (or if you want to use [LiteFS](/docs/litefs))&mdash;then you'll want to use [Fly Volumes](/docs/volumes/).

Explore these, and further options, for data storage in the following sections.

## Fly Volumes - Disk storage

Anything an App VM writes to its root disk is ephemeral: when the VM is redeployed, the root file system is rebuilt using its Docker image, deleting any data written to it since it was started up. This is fine for `/tmp` files, but most apps need to keep state in a database or another form of persistent storage.

- **[Fly Volumes](/docs/volumes/)** - Persistent storage on Fly.io is provided by Fly Volumes. You can use volumes on an app directly, or run a separate database app with volume storage and connect an app to that. A Fly Volume is a slice of NVMe disk storage attached to the server that hosts your Machine. Volumes have pros and cons, and you should read the [Fly volumes overview](/docs/reference/volumes/) before deciding whether they're the best solution for your use case.

## Fly.io database projects

These are projects that we develop and support. They're not managed services; you can deploy them yourself as Fly Apps.

- **[Fly Postgres](/docs/postgres/)** - [PostgreSQL](https://www.postgresql.org/+external) is a popular relational database. When you deploy an App on Fly.io, we give you the option to launch a Fly Postgres App and attach it to your App. We provide tools for deployment and management; you manage the cluster once it's deployed.
- **[LiteFS for SQLite](/docs/litefs/)** - [SQLite](https://www.sqlite.org/index.html+external) is a very lightweight file-based database. [LiteFS](/docs/litefs/) is a distributed file system that transparently replicates SQLite databases. You deploy it and you manage it.

## Partner integrations running on Fly.io

- **[Supabase Postgres (beta)](/docs/reference/supabase/)** - [Supabase](https://supabase.com/database+external) Postgres is a full-featured and fully-managed Postgres database on Fly.io infrastructure.
- **[Tigris Global Object Storage (beta)](/docs/reference/tigris/)** - [Tigris](https://www.tigrisdata.com/+external) is a globally distributed S3-compatible object storage service on Fly.io infrastructure.
- **[Upstash for Redis](/docs/reference/redis/)** - [Redis](https://redis.io/+external) is an in-memory database commonly used for caching. A managed service by [Upstash](https://upstash.com/+external).

## Other storage apps

If your application calls for a different solution, you can deploy it yourself as an App on Fly.io. These examples can help you get started with other popular storage options.

- **[MySQL and MariaDB](/docs/app-guides/mysql-on-fly/)** - [MySQL](https://www.mysql.com/+external) is a popular relational database. [MariaDB](https://mariadb.org/+external) is a community fork of MySQL and is compatible with MySQL.

- **[EdgeDB](/docs/app-guides/edgedb/)** - [EdgeDB](https://www.edgedb.com/+external) is a graph-relational database that runs on top of Postgres.

- **[MinIO Object Storage](/docs/app-guides/minio/)** - [MinIO](https://min.io/+external) is software that allows you to self-host S3-compatible storage.

## Recommended external providers

If you want a different fully-managed database or storage solution for your Fly Apps, there are many great options, including:

- [Crunchy Bridge Managed Postgres](https://www.crunchydata.com/products/crunchy-bridge+external) (on AWS, Azure, GCP, or Heroku)
- [Neon Serverless Postgres](https://neon.tech/+external)
- [PlanetScale Serverless MySQL](https://planetscale.com/+external)
- [MinIO Hosted Object Storage](https://min.io/+external)
- [Fauna](https://fauna.com/+external) ([guide to use with Fly Apps](/docs/app-guides/fauna/))

## Other places

You can connect your Fly Apps to the usual suspects, too:

- [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/+external)
- [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/products/postgresql/#overview+external)
- [Digital Ocean Managed Postgres](https://www.digitalocean.com/products/managed-databases-postgresql+external)
- [Google Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres/+external)
- [Heroku Managed Data Services](https://www.heroku.com/managed-data-services+external)
- [AWS S3 Object Storage](https://aws.amazon.com/s3/+external)
