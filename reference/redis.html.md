---
title: Upstash for Redis®*
layout: docs
sitemap: false
nav: firecracker
---

<aside class="callout">
  &#42;Redis is a registered trademark of Redis Ltd. Any rights therein are reserved to Redis Ltd. Any use by Fly.io is for referential purposes only and does not indicate any sponsorship, endorsement or affiliation between Redis and Fly.io.
</aside>

[Upstash for Redis](https://docs.upstash.com/redis) is a fully-managed, Redis-compatible database service offering global read replicas for reduced latency in distant regions. Upstash databases are provisioned inside your Fly organization, ensuring private, low-latency connections to your Fly applications.

See the [What you Should Know](#what-you-should-know) section for more details about this service.

## Pricing

Upstash offers one free, resource-limited database per Fly organization. After that, all databases are billed by request count on a pay-as-you-go basis. Check the official [Upstash Pricing](https://upstash.com/pricing) page for details.

Note that empty responses are not counted towards your bill. This prevents billing for standard polling behavior of tools like [Sidekiq](https://sidekiq.org/) or [BullMQ](https://bullmq.io/).

Your database charges will show up on your monthly Fly.io bill. You can track database usage details in the [Upstash web console](#the-upstash-web-console).


## Create and manage a Redis database

Creating and managing databases happens exclusively via the [Fly CLI](/docs/hands-on/install-flyctl/). Install it, then [signup for a Fly account](https://fly.io/docs/getting-started/log-in-to-fly/).

### Create and get status of a Redis database

```cmd
flyctl redis create
```
```output
? Select Organization: fly-apps (fly-apps)
? Choose a primary region (can't be changed later) Madrid, Spain (mad)
? Optionally, choose one or more replica regions (can be changed later): Amsterdam, Netherlands (ams)
? Select an Upstash Redis plan:
> Pay-as-you-go
  Free
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
aaV829vaMVQGbi5	late-waterfall-1133	fly-apps     	Free	mad           	ams
```

Note the database name, then fetch its status.

```cmd
fly redis status late-waterfall-1133
```
```output
Redis
  ID             = aaV829vaMVDGbi5
  Name           = late-waterfall-1133
  Plan           = Free
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