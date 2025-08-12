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
- Multiple databases and schemas on that cluster
- Fly.io Support Portal to log tickets and get help
- Any modules and extensions included in the [default Postgres 16 distribution](https://www.postgresql.org/docs/16/contrib.html)
- The third party `pgvector` extension for vector similarity search, if enabled when provisioning your database
- The third party `PostGIS` extension for adding geospatial data support, if enabled when provisioning your database

### What's not there yet

At the moment, the following features are under development:

- Security patches and version upgrades
- Third Party Postgres extensions besides `pgvector` or `postGIS`
- Customer-facing monitoring and alerting
- Database migration tools

We're working on expanding these capabilities and will provide updates as they become available.

## Regions

The current regions available for deploying Fly.io Managed Postgres are:

- `fra` - Frankfurt, Germany
- `gru` - São Paulo, Brazil
- `iad` - Ashburn, Virginia, USA
- `lax` - Los Angeles, California, USA
- `ord` - Chicago, Illinois, USA
- `syd` - Sydney, Australia

These regions are coming soon:

- `ams` - Amsterdam, Netherlands
- `nrt` - Tokyo, Japan
- `sin` - Singapore
- `sjc` - San Jose, California, USA


We'll be rolling out more regions as soon as we can. Choose a region close to your application for optimal performance.

## Database Storage

Managed Postgres storage features:

- Maximum storage limit: 1 TB
- Initial storage size: Up to 500 GB at creation
- Storage is replicated across all nodes in your cluster
- Storage growth is monitored and managed automatically

## Pricing

The price of running Fly.io Managed Postgres depends on:

- Your selected Managed Postgres Plan
- The amount of storage your cluster has 

Your MPG plan determines the CPU and Memory configuration for your cluster. All plans include high availability, backups, and connection pooling. 

The current monthly plan pricing is:
| Plan | CPU | Memory | Monthly Price |
| --- | --- | --- | --- |
| Basic | Shared-2x | 512MB | $38.00 |
| Launch | Performance-2x| 8GB | $282.00 |
| Scale | Performance-4x | 16GB | $962.00 |

Database storage is priced at **$0.30 per provisioned GB for a 30-day month**, with each node (primary + replica) incurring its own cost. For example, if you have 10GB of storage provisioned for your cluster, your monthly storage cost will be $6.00 ($0.30 * 10GB for the primary, $.30 * 10GB for the replica). 

Databases created or deleted mid-month will have their pricing prorated accordingly.
