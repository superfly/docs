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

## Creating a Postgres **app**
To create a Postgres cluster, use the `fly postgres create` command. The command will walk you through the creation with prompts for name, region, and VM resources.


```cmd
fly postgres create
```

```output
? Choose an app name (leave blank to generate one): pg-test
automatically selected personal organization: TestOrg
? Select regions:  [Use arrows to move, type to filter]
> Amsterdam, Netherlands (ams)
  Paris, France (cdg)
  Denver, Colorado (US) (den)
  ...
  Sydney, Australia (syd)
  Montreal, Canada (yul)
  Toronto, Canada (yyz)
? Select regions: Miami, Florida (US) (mia)
```

During this process, you get to choose from several preset resource configurations for the app:

```
? Select configuration:  [Use arrows to move, type to filter]
> Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
  Production - Highly available, 2x shared CPUs, 4GB RAM, 40GB disk
  Production - Highly available, 4x shared CPUs, 8GB RAM, 80GB disk
  Specify custom configuration
```

The "Production" options give you a two-node cluster in a leader-replica configuration. A single-node "Development" instance can readily be scaled and [expanded to more regions](https://fly.io/docs/postgres/advanced-guides/high-availability-and-global-replication/).

```
Creating postgres cluster pg-test in organization TestOrg
Creating app...
Setting secrets...
Provisioning 1 of 1 machines with image flyio/postgres:14.4
Waiting for machine to start...Machine e784079b449483 is created
  Username:    postgres
  Password:    51QstQZZ2HPcozU
  Hostname:    pg-test.internal
  Proxy port:  5432
  Postgres port:  5433
Save your credentials in a secure place -- you won't be able to see them again!

Connect to postgres
Any app within the TestOrg organization can connect to this Postgres using the following credentials:
For example: postgres://postgres:51QstQZZ2HPcozU@pg-test.internal:5432
```

After answering all the prompts, you'll see a message saying that the cluster is being created. Take heed of the reminder to save your password in a safe place!

Your new Postgres cluster is ready to use once the deployment is complete.

Before we get any further, note that the automated Postgres creation process doesn't generate a `fly.toml` file in the working directory. This means that when you use `flyctl` commands with Fly Postgres apps, you'll have to specify the app, like so:

```cmd
flyctl <command> -a <postgres-app-name>
```
