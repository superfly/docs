---
title: Getting Started
layout: framework_docs
order: 1
subnav_glob: docs/rails/getting-started/*.html.*
objective: Quickly get a Postgres instance up and running on Fly.
---
<div class="callout">
If you have flyctl [**v0.0.412**](https://github.com/superfly/flyctl/releases/tag/v0.0.412) or newer installed, new Fly Postgres clusters you create will use our next-gen Apps V2 architecture, built on [**Fly Machines**](/docs/reference/machines/).
</div>

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

The "Production" options give you a two-node cluster in a leader-replica configuration. A single-node "Development" instance can readily be scaled and [expanded to more regions](#high-availability-and-global-replication).

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
