---
title: "This Is Not Managed Postgres"
objective: Read our warnings about why we don't call Fly Postgres "managed"!
layout: framework_docs
order: 1
---

Before you use Fly Postgres, here are some things worth understanding about it:

Fly Postgres is a regular app you deploy on Fly.io, with an automated creation process and some platform integration to simplify management. It relies on building blocks available to all Fly apps, like `flyctl`, volumes, private networking, health checks, logs, metrics, and more. The source code is available on [GitHub](https://github.com/fly-apps/postgres-flex) to view and fork.

This is not a managed database. If Postgres crashes because it ran out of memory or disk space, you'll need to do a little work to get it back.

## Here's what Fly.io manages

- **Basic provisioning & upgrade tools** - `fly pg` provides a set of commands and building blocks that automates the provisioning of databases, connecting them to your applications, and accessing remote Postgres shells.
- **Daily volume snapshots** - Fly.io takes daily snapshots of Postgres volumes and saves them for 5 days.
- **Global networking & server infrastructure** - Fly.io provides the Firecracker VMs and interconnecting WireGuard network to run your Postgres database cluster.
- **Prometheus metrics** - Fly.io collects and exposes various metrics via Prometheus, but you have to set up a tool, like Grafana, for aggregation and alerting.
- **Open Source templates** - Templates and documentation are available at [https://github.com/fly-apps/postgres-flex](https://github.com/fly-apps/postgres-flex) in the event that you need to work the Fly Postgres app to fine-tune it for your specific application.

## Here's what you manage

Deploying a Fly Postgres database means you may need to manage the following:

- **Provisioning the right cluster config for you** - Consider what your availability needs are. If you run only a single instance, then anything that happens to that disk, that server or the network in that region can cause your database to be unavailable.
- **Scaling storage and memory resources** - If your database runs out of disk space or memory, you'll have to scale it up, or down if you don't need the resources.
- **Upgrading Postgres versions & security patches** - Fly.io provides tools like `fly image update` to upgrade your database instances to new minor versions of Postgres, but you'll have to run the upgrades yourself. Same for security patches: you'll have to apply those to running Postgres clusters.
- **Developing a database backup & restoration plan** - Fly.io's self-managed Postgres ships with a basic daily volume snapshot tool that keeps snapshots around for 5 days. It does not manage off-site backups, etc.
- **Monitoring & alerts** - Fly.io collects and exposes relevant Prometheus metrics, but you'll have to configure your own monitoring and alerts to keep tabs on the performance and resource utilization of your database instances.
- **Recovering from outages** - If the volume in your database fills up, a replica fails, etc. you'll have to do a little bit of work to bring your database back to health.
- **Global replication** - You can add read-only replicas outside the primary region to [speed up read-heavy globally distributed apps](https://fly.io/blog/globally-distributed-postgres/),  by scaling your Fly Postgres app. It's up to you to tweak your application to get writes to the leader instance, but the [Fly-Replay header](https://fly.io/docs/reference/fly-replay/) simplifies that.
- **Configuration Tuning** - You may need to tune your Postgres configuration to match your application's needs. 
There are a lot of knobs to turn, but `fly pg config` only supports a few of them out of the box. For more details, see [Postgres Configuration Tuning](https://fly.io/docs/postgres/managing/configuration-tuning/).
- **Advanced customization** - TimescaleDB is included in the default image and can be enabled with these [instructions](https://fly.io/docs/postgres/managing/enabling-timescale/). If your application demands additional Postgres extensions or something else in the VM, you can [fork and maintain your own branch of Fly's open source Postgres Flex app](https://github.com/fly-apps/postgres-flex). 

## Fully managed Postgres

<div class="important icon">
Supabase Postgres, a fully managed Postgres database on Fly.io, is now in beta. Learn more about [Supabase Postgres](/docs/reference/supabase/) on Fly.io.
</div>

### Recommended External Providers

If you want a fully managed database solution for your Fly Apps, there are many great options, including:

- [Crunchy Bridge Managed Postgres](https://www.crunchydata.com/products/crunchy-bridge+external) (on AWS, Azure, GCP, or Heroku)
- [Neon Serverless Postgres](https://neon.tech/+external)
- [PlanetScale Serverless MySQL](https://planetscale.com/+external) ([guide to use with Fly Apps](https://fly.io/docs/app-guides/planetscale/))
- [Supabase Postgres](https://supabase.com/database+external)

### Other Places

You can connect your Fly Apps to the usual suspects, too:

- [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/+external)
- [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/products/postgresql/#overview+external)
- [Digital Ocean Managed Postgres](https://www.digitalocean.com/products/managed-databases-postgresql+external)
- [Google Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres/+external)
- [Heroku Managed Data Services](https://www.heroku.com/managed-data-services+external)
