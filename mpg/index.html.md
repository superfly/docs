---
title: Managed Postgres
layout: docs
nav: firecracker
date: 2025-07-10
redirect_from: /docs/mpg/overview/
---

<figure class="flex justify-center">
  <img src="/static/images/Managed_Postgres.png" alt="Illustration by Annie Ruygt of a balloon doing a lot of tasks" class="w-full max-w-lg mx-auto">
</figure>

## What is Managed Postgres?

Fly.io's Managed Postgres is our fully-managed database service that handles all aspects of running production PostgreSQL databases where we take care of:

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
- Any modules and extensions included in the [default Postgres 16 distribution](https://www.postgresql.org/docs/16/contrib.html)
- The third party `pgvector` extension for vector similarity search, if enabled when provisioning your database
- The third party `PostGIS` extension for adding geospatial data support, if enabled when provisioning your database

### What's not there yet

At the moment, the following features are under development:

- Security patches and version upgrades
- Multiple databases or schemas per cluster
- Third Party Postgres extensions besides `pgvector` or `postGIS`
- Customer-facing monitoring and alerting
- Database migration tools

We're working on expanding these capabilities and will provide updates as they become available.

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
