---
title: "Fly Postgres"
layout: framework_docs
---

[Postgres](https://www.postgresql.org/), or PostgreSQL, is a powerful open-source object relational database system.

Fly Postgres is a regular Fly.io app, with an automated creation process and some platform integration to simplify management. It relies on building blocks available to all Fly apps, like `flyctl`, volumes, private networking, health checks, logs, metrics, and more. The source code is available on [GitHub](https://github.com/fly-apps/postgres-ha) to view and fork.

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

## About **Free** Postgres on Fly.io

You can use Fly's [free resource allowance](https://fly.io/docs/about/pricing/#free-allowances) in one place, or split it up. The following Postgres configurations fit within the free volume usage limit:

* single node, 3gb volume (single database)
* 2 x 1gb volumes (database in two regions, or a primary and replica in the same region)
* 3 x 1gb volumes (database in three regions)

If you want to keep your whole project free, save some compute allowance for your other apps.

See also [How to convert your not-free Postgres to free Postgres](https://community.fly.io/t/how-to-convert-your-not-free-postgres-to-free-postgres/3888).

