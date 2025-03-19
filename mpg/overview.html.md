---
title: Managed Postgres Overview
layout: docs
nav: firecracker
toc: false
---

<div class="important icon">Managed Postgres is currently in Technical Preview. To request access, please contact <a href="mailto:beta@Fly.io">beta@fly.io</a></div>

<div>
    <img src="/static/images/Managed_Postgres.png" alt="Managed Postgres Overview - A visual representation of Fly.io's managed PostgreSQL service">
</div>

## What is Managed Postgres?

Fly.io's Managed Postgres is our database-as-a-service offering where we handle:

- Automatic backups and point-in-time recovery (coming soon)
- High availability and failover
- Security patches and version upgrades
- Performance monitoring
- Resource scaling (CPU, RAM, storage)
- 24/7 support and incident response

### What's included

If you're enrolled in the Technical Preview, you'll be able to access:

- A highly-available Postgres cluster within your Fly.io organization's [private network](/docs/networking/private-networking/)
- A single database on that cluster
- Fly.io Support Portal to log tickets and get help

### What's not there yet

At the moment, backups are still under development and we haven't opened up access to them just yet. You also can't currently create more databases or schemas on a cluster (though you can create more clusters). You won't yet be able to add Postgres extensions, either.

We're working on expanding these capabilities and will provide updates as they become available.

## Creating a Managed Postgres Instance

To create a new Managed Postgres cluster, visit your Fly.io dashboard and click the "Create new cluster" button in the Managed Postgres section.

You'll be prompted to choose:

- Cluster name
- Region
- A plan with predefined hardware resources (CPU, Memory)
- Storage size

<div>
    <img src="/static/images/create-mpg.webp" alt="A screenshot of the Managed Postgres creation page.">
</div>

## Connecting to Your Managed Postgres Database

To connect your Fly.io application to your Managed Postgres instance:

- After creation, the "Connection" tab will display your connection string
- Set it as a secret in your Fly.io application:

```cmd
fly secrets set DATABASE_URL="postgres://username:password@host:port/database"
```

- Your application can now use the `DATABASE_URL` environment variable to connect

## Using flyctl with Managed Postgres

You can interact with your Managed Postgres instances using the Fly.io CLI (`flyctl`). Here are the key commands:

### Connecting with psql

To connect directly to your Managed Postgres database using psql:

```cmd
fly mpg connect [flags]
```

This command will establish a direct connection to your database using the psql client.

### Setting up a Proxy Connection

To create a proxy connection to your Managed Postgres database:

```cmd
fly mpg proxy [flags]
```

This command is useful when you want to connect to your database from your local machine using tools other than psql.

## Regions

The current regions available for deploying Fly.io Managed Postgres are fra, gru, iad, lax, ord, and syd. We'll be rolling out more regions as soon as we can.

## Database Storage

Our Managed Postgres comes with an auto-grow disk, so you don't have to worry about manually scaling your storage. Storage grows automatically with your data, with an upper limit of **1 TB**. When you create a cluster, the maximum storage size you can set is **500 GB**.

## Pricing

Currently, everyone with access to the Technical Preview has been given credits sufficient for two full months' worth of use of the "Launch" plan ($282/month).

The price of running Fly.io Managed Postgres depends on the CPU/Memory configuration you choose and the region in which you're deploying.

Database storage is priced at **$0.30 per GB for a 30-day month**, with each node (primary + replica) incurring its own cost.