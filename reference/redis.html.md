---
title: Managed Redis on Fly
layout: docs
sitemap: false
nav: firecracker
status: alpha
---

[Upstash Redis](https://docs.upstash.com/redis) is a fully-managed, Redis-compatible database service. Upstash databases support global read replicas for reduced latency in distant regions. Upstash databases are provisioned inside your Fly organization, ensuring private, low-latency connections to your Fly applications.

See the [What you Should Know](#what-you-should-know) section for more details about this service.

**Upstash Redis is in public beta. Pricing will probably change.**
## Create and manage an Upstash Redis database

Creating and managing databases happens exclusively via the [Fly CLI](/getting-started/installing-flyctl/). Install it, then [signup for a Fly account](https://fly.io/docs/getting-started/log-in-to-fly/).

### Create and get status of an Upstash Redis database

```cmd
flyctl redis create
```
```output
? Select Organization: fly-apps (fly-apps)
? Choose a primary region (can't be changed later) Madrid, Spain (mad)
? Optionally, choose one or more replica regions (can be changed later): Amsterdam, Netherlands (ams)
? Select an Upstash Redis plan Free: 100 MB Max Data Size
```

Once created, check the list of Redis databases.

```cmd
flyctl redis list
```
```output
ID             	NAME               	ORG          	PLAN	PRIMARY REGION	READ REGIONS
aaV829vaMVQGbi5	late-waterfall-1133	fly-apps     	Free	mad           	ams
```

Note the database ID, then fetch its status.

```cmd
fly redis status aaV829vaMVDGbi5
```
```output
Redis
  ID             = aaV829vaMVDGbi5
  Name           = late-waterfall-1133
  Plan           = Free
  Primary Region = mad
  Read Regions   = ams
  Private URL     = redis://password@fly-magical-javelin-30042.upstash.io
```
### Update an Upstash Redis database

Upstash Redis instances can't change their primary region or name, but the following may change:

* Read regions
* Pricing plan
* Eviction settings

Use `flyctl redis update` and follow the prompts. Changing region settings should not cause downtime.

### Delete an Upstash Redis database

Deleting a Redis database can't be undone. Be careful!

```cmd
fly redis delete aaV829vaMVQDbi5
```
```output
Your Redis cluster aaV829vaMVQDbi5 was deleted
```

## What you should know

Once provisioned, the database primary region cannot be changed.

### Traffic routing

Upstash Redis is available in all Fly regions via a [private IPv6 address](/reference/private-networking#flycast) restricted to your Fly organization. Traffic is automatically routed to the nearest replica, or to the primary instance. If you plan to deploy in a single region, ensure that your database is deployed in the same region as your application.

### Writing to replica regions

**Replicas forward writes to the primary**. Replicas can't be used for region-local writes. Writes are synchronous, and synchronous writes over geographical distance experience latency. Plan for this latency in your application design.

If you're using Redis as a fast, region-local cache, setup separate databases per-region and enable object eviction.

### Memory limits and object eviction policies

By default, Upstash Redis will disallow writes when the memory limit has been reached. If you enable **eviction** during creation on on update, Upstash Redis will evict keys to free up space.

First, keys marked with a TTL will be evicted at random. In the absence of volatile keys, keys will be chosen randomly for eviction. This is roughly the combination of the `volatile-random` and `allkeys-random` [eviction policies available in standard Redis](https://redis.io/docs/manual/eviction/).

Note that items marked with an explicit TTL will expire accurately, regardless of whether eviction is enabled.

## Pricing

This pricing is subject to change until Redis Upstash is officially released.

|&nbsp;| Free | 200MB | 500MB |
|------|------|-------|-------|
|Max Data size|100MB|200MB|500MB|
|Max Connections|100|300|500|
|Max Command/sec|300|300|500|
|Max Daily Commands|10000|Unlimited|Unlimited|
|Max Daily Bandwidth|10GB|10GB|30GB|
|Price per month, per region|$0|$10|$20|