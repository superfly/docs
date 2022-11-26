---
title: "This Is Not Managed Postgres"
objective: Read our warnings about why we don't call Fly Postgres "managed"!
layout: framework_docs
order: 1
---

Before you use Fly Postgres, here are some things worth understanding about it:

Fly Postgres is a regular app you deploy on Fly.io, with an automated creation process and some platform integration to simplify management. It relies on building blocks available to all Fly apps, like `flyctl`, volumes, private networking, health checks, logs, metrics, and more. The source code is available on [GitHub](https://github.com/fly-apps/postgres-ha) to view and fork.

This is not a managed database. If Postgres crashes because it ran out of memory or disk space, you'll need to do a little work to get it back.

### Here's what Fly.io manages

- **Basic provisioning & upgrade tools** - `fly pg` provides a set of commands and building blocks that automates the provisioning of databases, connecting them to your applications, and accessing remote Postgres shells.
- **Daily volume snapshots** - Fly.io takes daily snapshots of Postgres volumes and saves them for 7 days.
- **Global networking & server infrastructure** - Fly.io provides the Firecracker VMs and interconnecting WireGuard network to run your Postgres database cluster.
- **Prometheus metrics** - Fly.io collects and exposes various metrics via Prometheus, but you have to set up a tool, like Grafana, for aggregation and alerting.
- **Open Source templates** - Templates and documentation are available at [https://github.com/fly-apps/postgres-ha](https://github.com/fly-apps/postgres-ha) in the event that you need to work the Fly Postgres app to fine-tune it for your specific application.

### Here's what you manage

Deploying a Fly Postgres database means you may need to manage the following:

- **Scaling storage and memory resources** - If your database runs out of disk space or memory, you'll have to scale it up, or down if you don't need the resources.
- **Upgrading Postgres versions & security patches** - Fly.io provides tools like `fly image update` to upgrade your database instances to new minor versions of Postgres, but you'll have to run the upgrades yourself. Same for security patches: you'll have to apply those to running Postgres clusters.
- **Developing a database backup & restoration plan** - Fly.io's self-managed Postgres ships with a basic daily volume snapshot tool that keeps snapshots around for 7 days. It does not manage off-site backups, etc.
- **Monitoring & alerts** - Fly.io collects and exposes relevant Prometheus metrics, but you'll have to configure your own monitoring and alerts to keep tabs on the performance and resource utilization of your database instances.
- **Recovering from outages** - If the volume in your database fills up, a replica fails, etc. you'll have to do a little bit of work to bring your database back to health.
- **Global replication** - You can add read-only replicas outside the primary region to [speed up read-heavy globally distributed apps](https://fly.io/blog/globally-distributed-postgres/),  by scaling your Fly Postgres app. It's up to you to tweak your application to get writes to the leader instance, but the [Fly-Replay header](https://fly.io/docs/reference/fly-replay/) simplifies that.
- **Configuration Tuning** - You may need to tune your Postgres configuration to match your application's needs. 
There are a lot of knobs to turn, but `fly pg config` only supports a few of them out of the box. For more details, see [Postgres Configuration](#postgres-configuration).
- **Advanced customization** - TimescaleDB is included in the default image and can be enabled with these [instructions](https://fly.io/docs/postgres/managing/enabling-timescale/). If your application demands additional Postgres extensions or something else in the VM, you can [fork and maintain your own branch of Fly's open source Postgres HA app](https://github.com/fly-apps/postgres-ha). 

## Fully managed Postgres

If you want a fully managed database solution for your Fly apps, there are many great options; for example:

- [Heroku Managed Data Services](https://www.heroku.com/managed-data-services)
- [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/products/postgresql/#overview)
- [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/)
- [Google Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres/)
- [Digital Ocean Managed Postgres](https://www.digitalocean.com/products/managed-databases-postgresql)
- [Neon Serverless Postgres](https://neon.tech/)
- [Supabase Postgres](https://supabase.com/database)

## About Free Postgres on Fly.io

You can use Fly.io's [free resource allowance](https://fly.io/docs/about/pricing/#free-allowances) in one place, or split it up. The following Postgres configurations fit within the free volume usage limit:

- Single node, 3gb volume (single database)
- 2 x 1gb volumes (database in two regions, or a primary and replica in the same region)
- 3 x 1gb volumes (database in three regions)

If you want to keep your whole project free, save some compute allowance for your other apps.
