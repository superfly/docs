---
title: Upstash Kafka
layout: docs
sitemap: false
nav: firecracker
---

<aside class="callout">
This service is in private beta, available in select regions. Write to (extensions@fly.io)[mailto:extensions@fly.io] to request access for your Fly.io organization.
</aside>

[Upstash Kafka](https://docs.upstash.com/kafka) is a fully-managed, pay-as-you-go Kafka service hosted on Fly.io infrastructure.

## Create and manage a Kafka cluster

Creating and managing clusters happens exclusively via the [Fly CLI](/docs/hands-on/install-flyctl/). Install it, then [signup for a Fly account](https://fly.io/docs/getting-started/log-in-to-fly/).

### Create and get status of a Kafka cluster

```cmd
flyctl ext kafka create
```
```output
? Select Organization: fly-apps (fly-apps)
? Choose a primary region (can't be changed later) Madrid, Spain (mad)
? Optionally, choose one or more replica regions (can be changed later): Amsterdam, Netherlands (ams)
```

### The Upstash web console

To view more details about database usage, connection strings, and more, use:

```cmd
flyctl redis dashboard <org_name>
```

### List your databases and view status
Get a list of all of your Redis databases.

```cmd
flyctl redis list
```
```output
ID             	NAME               	ORG          	PLAN	PRIMARY REGION	READ REGIONS
aaV829vaMVQGbi5	late-waterfall-1133	fly-apps     	payg	mad           	ams
```

Note the database name, then fetch its status.

```cmd
fly redis status late-waterfall-1133
```
```output
Redis
  ID             = aaV829vaMVDGbi5
  Name           = late-waterfall-1133
  Plan           = Pay-as-you-go
  Primary Region = mad
  Read Regions   = ams
  Private URL     = redis://password@fly-late-waterfall-1133.upstash.io
```

### Connect to a Redis database

If you have `redis-cli` installed, you can connect directly to your Redis database and run commands.

```cmd
fly redis connect
? Select a database to connect to empty-water-3291 (sjc) 200M
Proxying local port 16379 to remote [fdaa:0:6d6b:0:1::3]:6379
127.0.0.1:16379> set foo bar
OK
127.0.0.1:16379> get foo
"bar"
127.0.0.1:16379>
```

### Update a Redis database

Upstash Redis instances can't change their primary region or name, but the following may change:

* Read regions
* Pricing plan
* Eviction settings

Use `flyctl redis update` and follow the prompts. Changing region settings doesn't cause downtime.

### Delete a Redis database

Deleting a Redis database can't be undone. Be careful!

```cmd
fly redis destroy my-redis-db
```
```output
Your Redis database my-redis-db was deleted
```

## What you should know

Once provisioned, the database primary region cannot be changed.

### Traffic routing

Upstash Redis is available in all Fly regions via a [private IPv6 address](/docs/networking/private-networking/#flycast-private-load-balancing) restricted to your Fly organization. Traffic is automatically routed to the nearest replica, or in the absence of nearby replicas, to the primary instance.

**If you plan to deploy in a single region, ensure that your database is deployed in the same region as your application.**

### Writing to replica regions

**Replicas forward writes to the primary**. Replicas can't be written to. Writes are synchronous, and synchronous writes over geographical distance experience latency. Plan for this latency in your application design.

If you're using Redis as region-local cache and don't require a shared cache, setup separate databases per-region and enable object eviction.

### Memory limits and object eviction policies

By default, Upstash Redis will disallow writes when the max data size limit has been reached. If you enable **eviction** during creation on update, Upstash Redis will evict keys to free up space.

First, keys marked with a TTL will be evicted at random. In the absence of volatile keys, keys will be chosen randomly for eviction. This is roughly the combination of the `volatile-random` and `allkeys-random` [eviction policies available in standard Redis](https://redis.io/docs/manual/eviction/).

Note that items marked with an explicit TTL will expire accurately, regardless of whether eviction is enabled.

## Pricing

Upstash Redis databases are billed by usage on a pay-as-you-go basis, with a free allowance of 10,000 commands per day. Check the official [Upstash Pricing](https://upstash.com/pricing) page for details.

Your usage is updated hourly on your monthly Fly.io bill. You can track database usage details in the [Upstash web console](#the-upstash-web-console) as well.

### Usage from Sidekiq, BullMQ and other prepackaged software

Tools like [Sidekiq](https://sidekiq.org/) or [BullMQ](https://bullmq.io/) make heavy use of Redis through polling, even when completely idle. Many of their polling commands return empty responses.

While Upstash won't count these responses against your usage, they tend to exceed 10,000 requests per day. You'll be notified if you pass this limit.
