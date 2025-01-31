---
title: Databases and storage
layout: docs
toc: true
nav: firecracker
---

The solution to persistent data storage is to usually connect your Fly App to a separate database or object store. If you need hardware-local disk storage on your Machines&mdash;for example, if your Fly App _is_ a database or if you want to use [LiteFS](/docs/litefs)&mdash;then you can use [Fly Volumes](/docs/volumes/).

## Fly Volumes - Disk storage

The Fly Machines in your app provide ephemeral storage, so you get a blank slate on every startup. For persistent storage on Fly.io, use Fly Volumes. You can attach volumes on an app directly, or run a separate database app with volume storage and connect an app to that.

- **[Fly Volumes](/docs/volumes/):** A Fly Volume is a slice of NVMe disk storage attached to the server that hosts your Machine. Read the [Fly Volumes overview](/docs/volumes/overview/) to find out if volumes are the best solution for your use case.

---

## Object storage services

_Object storage service from our extension partners._

- **[Tigris Global Object Storage](/docs/tigris/)** - [Tigris](https://www.tigrisdata.com/+external) is a globally distributed S3-compatible object storage service on Fly.io infrastructure.

---

## Managed database services

_Managed database services from our extension partners._

- **[Upstash for Redis](/docs/upstash/redis/)** - [Redis](https://redis.io/+external) is an in-memory database commonly used for caching. A managed service by [Upstash](https://upstash.com/+external).

---

## Fly.io databases

_These are not managed services; you deploy and manage them yourself as Fly Apps._

- **[Fly Postgres](/docs/postgres/)** - Our Postgres app provides a [PostgreSQL](https://www.postgresql.org/+external) database with some tools to make it easier to manage yourself. When you deploy an App on Fly.io, we give you the option to launch a Fly Postgres App and attach it to your App.

- **[LiteFS for SQLite](/docs/litefs/)** - [SQLite](https://www.sqlite.org/index.html+external) is a very lightweight file-based database. [LiteFS](/docs/litefs/) is a distributed file system that transparently replicates SQLite databases. You deploy it and you manage it.

---

## Other database and storage options

_Examples to help you get started with other popular storage options._

- **[MySQL and MariaDB](/docs/app-guides/mysql-on-fly/)** - [MySQL](https://www.mysql.com/+external) is a popular relational database. [MariaDB](https://mariadb.org/+external) is a community fork of MySQL and is compatible with MySQL.

- **[EdgeDB](/docs/app-guides/edgedb/)** - [EdgeDB](https://www.edgedb.com/+external) is a graph-relational database that runs on top of Postgres.

- **[MinIO Object Storage](/docs/app-guides/minio/)** - [MinIO](https://min.io/+external) is software that allows you to self-host S3-compatible storage.

---

## Recommended external providers

_Options for different fully-managed databases or storage solutions for your Fly Apps._

- [Crunchy Bridge Managed Postgres](https://www.crunchydata.com/products/crunchy-bridge+external) (on AWS, Azure, GCP, or Heroku)
- [Neon Serverless Postgres](https://neon.tech/+external)
- [PlanetScale Serverless MySQL](https://planetscale.com/+external) ([guide to use with Fly Apps](/docs/app-guides/planetscale/))
- [MinIO Hosted Object Storage](https://min.io/+external)
- [Fauna](https://fauna.com/+external) ([guide to use with Fly Apps](/docs/app-guides/fauna/))

---

## More external providers

_You can connect your Fly Apps to the usual suspects, too._

- [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/+external)
- [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/products/postgresql/#overview+external)
- [Digital Ocean Managed Postgres](https://www.digitalocean.com/products/managed-databases-postgresql+external)
- [Google Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres/+external)
- [Heroku Managed Data Services](https://www.heroku.com/managed-data-services+external)
- [AWS S3 Object Storage](https://aws.amazon.com/s3/+external)
