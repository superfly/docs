---
title: Managed Postgres Overview
layout: docs
nav: firecracker
toc: false
---

<div class="important icon">**Important:** Managed Postgres is currently in Technical Preview. To request access, please contact <a href="mailto:beta@Fly.io">beta@Fly.io</a></div>

## What is Managed Postgres?

Fly.io's Managed Postgres is our database-as-a-service offering where we handle:

- Automatic backups and point-in-time recovery
- High availability and failover
- Security patches and version upgrades
- Performance monitoring and optimization
- Scaling resources (CPU, RAM, storage)
- 24/7 support and incident response

### What's included

If you're enrolled in the Technical Preview, you'll be able to access:

- A cluster, which consists of a primary and a replica that both sit behind a proxy so we can manage failovers for issues, updates, etc. 
- You'll get access to a single database on that cluster.

### What's not there yet

At the moment, you can't create more databases or schemas inside a cluster (you can create more clusters). You can't add Postgres extensions. Database backups are in-progress, but we haven't opened up access to them just yet.

We're working out how we can give you more access to these kinds of things. More to come on all this soon.

## Creating a Managed Postgres Instance

To create a new managed Postgres instance, visit your Fly dashboard and click the "Create Database" button in the Managed Postgres section.

During creation, you'll be prompted to choose:
- Instance name
- Region
- Hardware resources (CPU, RAM, storage)

## Connecting to Your Managed Postgres Database

To connect your Fly.io application to your managed Postgres instance:

1. After creation, the "Connection" tab will display your connection string
2. Set it as a secret in your Fly.io application:

   ```cmd
   fly secrets set DATABASE_URL="postgres://username:password@host:port/database"
   ```

3. Your application can now use the `DATABASE_URL` environment variable to connect

## Pricing

Currently, everyone with access to the Technical Preview has been given credits sufficient for two full months' worth of use of the "Launch" plan ($282/month).

The price of running Fly.io Managed Postgres depends on the CPU/Memory you choose, and the region in which you're deploying.

The pricing for Database storage is $0.30 per GB for a 30-day month and each node (primary + each replica) will have its own cost.

## Regions

The current regions available for deploying Fly.io Managed Postgres are fra, gru, iad, lax, ord, and syd. We'll be rolling out more regions as soon as we can.

## Database Storage

Our Managed Postgres comes with an auto-grow disk, so you don't have to worry about manually scaling your storage. Storage grows automatically with your data, with an upper limit of **1 TB**. When you create a cluster, the maximum storage size you can set is 500GB.

Storage is **$0.30 per GB for a 30-day month** and each node (primary + each replica) will have its own cost.
