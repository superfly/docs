---
title: Managed Postgres Overview
layout: docs
nav: firecracker
toc: false
---


<figure class="flex justify-center">
  <img src="/static/images/Managed_Postgres.png" alt="Illustration by Annie Ruygt of a balloon doing a lot of tasks" class="w-full max-w-lg mx-auto">
</figure>

## What is Managed Postgres?

Fly.io's Managed Postgres is our database-as-a-service offering where we handle:

- Automatic backups and recovery
- High availability with automatic failover
- Performance monitoring and metrics
- Resource scaling (CPU, RAM, storage)
- 24/7 support and incident response
- Automatic encryption of data at rest and in transit

### What's included

You'll be able to access:

- A highly-available Postgres cluster within your Fly.io organization's [private network](/docs/networking/private-networking/)
- A single database on that cluster
- Fly.io Support Portal to log tickets and get help
- The `pgvector` extension for vector similarity search

### What's not there yet

At the moment, the following features are under development:

- Security patches and version upgrades
- Multiple databases or schemas per cluster
- Postgres extensions besides `pgvector`
- Customer-facing monitoring and alerting
- Database migration tools

We're working on expanding these capabilities and will provide updates as they become available.

## Creating a Managed Postgres Instance

To create a new Managed Postgres cluster, visit your Fly.io dashboard and click the "Create new cluster" button in the Managed Postgres section.

You'll be prompted to choose:

- Cluster name (must be unique within your organization)
- Region (see available regions below)
- A plan with predefined hardware resources:
  - Basic: 2 shared vCPUs, 1GB RAM
  - Launch: 2 Performance vCPUs, 8GB RAM
  - Scale: 4 Performance vCPUs, 32GB RAM
- Storage size (up to 500GB at creation)

<div>
    <img src="/static/images/create-mpg.webp" alt="A screenshot of the Managed Postgres creation page.">
</div>

## Connecting to Your Managed Postgres Database

To connect your Fly.io application to your Managed Postgres instance:

1. After creation, the "Connection" tab will display your connection string
2. Set it as a secret in your Fly.io application:

```cmd
fly secrets set DATABASE_URL="postgres://username:password@host:port/database"
```

3. Your application can now use the `DATABASE_URL` environment variable to connect

For security, the connection string uses SSL by default. Make sure your application's Postgres client is configured to use SSL.

## Using flyctl with Managed Postgres

You can interact with your Managed Postgres instances using the Fly.io CLI (`flyctl`). Here are the key commands:

### Connecting with psql

To connect directly to your Managed Postgres database using psql:

```cmd
fly mpg connect [flags]
```

This command will establish a direct connection to your database using the psql client. You'll need psql installed locally.

### Setting up a Proxy Connection

To create a proxy connection to your Managed Postgres database:

```cmd
fly mpg proxy [flags]
```

This command is useful when you want to connect to your database from your local machine using tools other than psql, such as database management tools or your application in development.

## Regions

The current regions available for deploying Fly.io Managed Postgres are:

- `fra` - Frankfurt, Germany
- `gru` - São Paulo, Brazil
- `iad` - Ashburn, USA
- `lax` - Los Angeles, USA
- `ord` - Chicago, USA
- `syd` - Sydney, Australia

We'll be rolling out more regions as soon as we can. Choose a region close to your application for optimal performance.

## Database Storage

Managed Postgres storage features:

- Maximum storage limit: 1 TB
- Initial storage size: Up to 500 GB at creation
- Storage is replicated across all nodes in your cluster
- Storage growth is monitored and managed automatically

## Pricing

The price of running Fly.io Managed Postgres depends on:

- CPU/Memory configuration (Launch, Performance, or Enterprise plans)
- Region in which you're deploying
- Storage usage

Database storage is priced at **$0.30 per GB for a 30-day month**, with each node (primary + replica) incurring its own cost. You can view detailed pricing in your Fly.io dashboard.