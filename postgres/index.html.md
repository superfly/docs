---
title: "Fly Postgres"
layout: framework_docs
redirect_from: /docs/reference/postgres/
---

[Postgres](https://www.postgresql.org/), formally known as PostgreSQL, is a powerful open-source object relational database system that's used by many popular web frameworks to persist application data.

<div class="callout">
If you have flyctl [v0.0.412](https://github.com/superfly/flyctl/releases/tag/v0.0.412) or newer installed, new Fly Postgres clusters you create will use our next-gen Apps V2 architecture, built on [Fly Machines](/docs/reference/machines/).

Your existing Fly Postgres clusters will continue to work, running on Fly Apps V1 (powered by Nomad).

<ul>
  <lh>Docs for Fly Postgres databases on Apps V1:</lh>
  <li>
    <a href="/docs/reference/postgres-on-nomad/">Fly Postgres on Apps V1</a>
  </li>
  <li>
    <a href="/docs/getting-started/multi-region-databases/">Multi-region PostgreSQL</a>
  </li>
</ul>


</div>

There's a few ways you can use Postgres databases with Fly apps that's crucially important for you to understand so you know how your application will scale and how to deal with failures.

## Fly Postgres

Fly Postgres is a regular Fly.io app, with an automated creation process and some platform integration to simplify management. It relies on building blocks available to all Fly apps, like `flyctl`, volumes, private networking, health checks, logs, metrics, and more. The source code is available on [GitHub](https://github.com/fly-apps/postgres-ha) to view and fork.

This is not a managed database. If Postgres crashes because it ran out of memory or disk space, you'll need to do a little work to get it back.

### Here's what Fly manages

- **Basic provisioning & upgrade tools** - `fly pg` provides a set of commands and building blocks that automates the provisioning of databases, connecting them to your applications, and accessing remote Postgres shells.
- **Daily volume snapshots** - Fly takes daily snapshots of Postgres volumes saves them for 7 days.
- **Global networking & server infrastructure** - Fly provides the Firecracker VMs and interconnecting wiregaurd network to run your Postgres database cluster.
- **Prometheus metrics** - Fly collects and exposes various metrics via Prometheus, but you have to setup a tool, like Grafana, for aggregation and alerting.
- **Open Source templates** - Templates and documentation are available at [https://github.com/fly-apps/postgres-ha](https://github.com/fly-apps/postgres-ha) in the event that you need to work the Fly Postgres app to fine-tune it for your specific application.

### Here's what you manage

Deploying a Fly Postgres database means you may need to manage the following:

- **Scaling storage and memory resources** - If your database is runs out of disk space or memory, you'll have to scale it up, or down if you don't need the resources.
- **Upgrading Postgres versions & security patches** - Fly provides tools like `fly image update` to upgrade your database instances to new versions of Postgres, but you'll have to run the upgrades yourself. Same for security patches—you'll have to apply those to running Postgres clusters.
- **Developing a database backup & restoration plan** - Fly's self-managed Postgres ships with a basic daily volume snapshot tool that keeps snapshots around for 7 days. It does not manage off-site backups, etc.
- **Monitoring & alerts** - Fly.io collects and exposes relevant Prometheus metrics, but you'll have to configure your own monitoring and alerts to keep tabs on the performance and resource utilization of your database instances.
- **Recovering from outages & fail-overs** - If the volume in your database fills up, a replica fails, etc. you'll have to do a little bit of work to bring your database back online.
- **Global replication** - You can add read-only replicas outside the primary region to [speed up read-heavy globally distributed apps](https://fly.io/blog/globally-distributed-postgres/),  by scaling your Fly Postgres app. It's up to you to tweak your application to get writes to the leader instance, but the [Fly-Replay header](https://fly.io/docs/reference/fly-replay/) simplifies that.
- **Advanced customization** - If your application demands additional Postgres extensions or something else in the VM, you can [fork and maintain your own branch of Fly's open source Postgres HA app](https://github.com/fly-apps/postgres-ha).

## Fully-managed Postgres

For people who want a fully managed database solution, there's many great options you can choose and connect to your Fly applications.

- [Heroku Managed Data Services](https://www.heroku.com/managed-data-services)
- [Azure Database for PostgreSQL](https://azure.microsoft.com/en-us/products/postgresql/#overview)
- [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/)
- [Google Cloud Sql for PostgreSQL](https://cloud.google.com/sql/docs/postgres/)

## About Free Postgres on Fly.io

You can use Fly's [free resource allowance](https://fly.io/docs/about/pricing/#free-allowances) in one place, or split it up. The following Postgres configurations fit within the free volume usage limit:

- Single node, 3gb volume (single database)
- 2 x 1gb volumes (database in two regions, or a primary and replica in the same region)
- 3 x 1gb volumes (database in three regions)

If you want to keep your whole project free, save some compute allowance for your other apps.

See also [How to convert your not-free Postgres to free Postgres](https://community.fly.io/t/how-to-convert-your-not-free-postgres-to-free-postgres/3888).
