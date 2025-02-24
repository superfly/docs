---
title: Fly Managed Postgres
layout: docs
nav: firecracker
toc: false
---

<div class="important icon">**Important:** Managed Postgres is currently in Technical Preview and requires special access. To request access, please contact <a href="mailto:beta@fly.io">beta@fly.io</a></div>


## What is Managed Postgres?

Fly.io's Managed Postgres is a service in which we take care of setting up, running, and maintaining a PostgreSQL database for you. We'll handle the administrative tasks like backups, patching, scaling, and high availability, so you can focus on managing your data and building the rest of your app.

### What's included

If you're enrolled in the beta, you'll be able to access:

- A cluster, which consists of a primary and a replica that both sit behind a proxy so we can manage failovers for issues, updates, etc. 
- You'll get access to a single database on that cluster. 

### What's not there yet

At the moment, you can't create more databases or schemas inside a cluster (you can create more clusters). You can't add Postgres extensions. Database backups are in-progress, but we haven't opened up access to them just yet.

We're working out how we can give you more access to these kinds of things.  More to come on all this soon.

## Pricing

Currently, everyone with access to the beta has been given credits sufficient for two full months' worth of use of the "Launch" plan ($282/month).

The price of running Fly.io Managed Postgres depends on the CPU/Memory you choose, and the region in which you're deploying.



The pricing for Database storage is $0.30 per GB for a 30-day month and each node (primary + each replica) will have its own cost.

## Regions

The current regions available for deploying Fly.io Managed Postgres are FRA, GRU, IAD, LAX, ORD, and SYD. We'll be rolling out more regions as soon as we can.

## Database Storage

Our Managed Postgres comes with an auto-grow disk, so you don't have to worry about manually scaling your storage. Storage grows automatically with your data, with an upper limit of **1 TB**.

Storage is **$0.30 per GB for a 30-day month** and each node (primary + each replica) will have its own cost.
