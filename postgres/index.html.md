---
title: "Fly Postgres"
layout: framework_docs
redirect_from: /docs/reference/postgres/
---

<div class="callout">
Fly Postgres clusters created with flyctl [v0.0.412](https://github.com/superfly/flyctl/releases/tag/v0.0.412) or newer use our next-gen [Apps V2](https://fly.io/docs/reference/apps/) architecture, built on [Fly Machines](/docs/reference/machines/). Existing Fly Postgres clusters will continue to work, powered by Nomad. Docs for these databases can be found here:
<ul>
  <li>
    <a href="/docs/reference/postgres-on-nomad/">Fly Postgres on Apps V1</a>
  </li>
  <li>
    <a href="/docs/getting-started/multi-region-databases/">Multi-region PostgreSQL</a>
  </li>
</ul>
</div>

[Postgres](https://www.postgresql.org/), formally known as PostgreSQL, is a powerful open source object relational database system that's used by many popular web frameworks to persist application data.

Fly Postgres is a Fly app with flyctl sugar on top to help you bootstrap and manage a database cluster for your apps. It comes with most commonly used functionality (replication, failover, metrics, monitoring and daily snapshots).

**[Read about why Fly Postgres is not the same thing as a managed database service](/docs/postgres/getting-started/what-you-should-know).**


When you create a Fly Postgres cluster, you're offered several preset configurations. The "High Availability" options are two-node clusters. In case of a node failure, a HA Fly Postgres cluster will automatically take the bad actor out of the picture and, if necessary, fail over leadership to the healthy node.

Flyctl also offers a single-instance "Development" config. If you choose this option and the hardware it's running on has network problems or the SSD fails, your database will go down. In the latter case, you will lose any data accumulated since the last snapshot. Fly Postgres is designed so that you can turn a single-node cluster into a high-availability one just by adding a second instance in the same region.

You can also add read-only replicas in other regions and take advantage of the Fly.io platform's proxy features to build a [Globally Distributed Postgres cluster](/docs/postgres/advanced-guides/high-availability-and-global-replication).

The Fly Postgres app is fully open source. Just fork [fly-apps/postgres-ha](https://github.com/fly-apps/postgres-ha) and add whatever meets your needs. You can even update an existing cluster with your new image using `fly deploy --image`. One caveat is that once you fork, you won't be able to use `fly postgres` commands to administer your app. 
