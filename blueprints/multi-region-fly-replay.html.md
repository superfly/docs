---
title: Multi-region databases and fly-replay
layout: docs
nav: firecracker
---

You want to run your app and database in multiple [regions](/docs/reference/regions/) close to your users, and deploying database read replicas will give you better performance on read requests. This is a good solution for apps with read-heavy database workloads. But you also want writes to be efficient, despite needing to write to a primary database on the other side of the world.

This blueprint will help you understand the concepts to implement an app, with a primary database and read replicas in multiple regions, that uses the `fly-replay` response header to re-route write requests to the primary region. Consider using this blueprint when:

- Your app's users are in more than one geographic region and you want low latency for reads in all regions.
- Your app has a request distribution of less than 50% writes.
- You don't want the architecture complications and potential for conflicts that come with running a multi-primary database cluster.

## Fly.io was made for multi-region apps

Fly.io already routes requests to the closest region where your app is deployed. Using regional database read replicas can further reduce latency since the Fly Machine (our fast-launching VM) receiving the request can connect to a database instance in the same region. Read replicas also reduce the overall load on the primary database. This multi-reader single-writer setup is great for read-heavy apps.

When your app receives write requests, you can use the `fly-replay` response header to forward the whole HTTP request to the primary region, which is often faster than connecting directly to the primary database from other regions. This is especially true when a request to an endpoint requires multiple database queries to complete; there would be extra latency on each query from a secondary region compared to a local connection in the primary region.

## How it works

The [`fly-replay` response header](/docs/networking/dynamic-request-routing/) instructs Fly proxy to redeliver (replay) the original request to another region or Machine in your app, or even another app in your organization. In this case, you’ll be replaying write requests to the Machine in the primary region. Using `fly-replay` to replay write requests is a general pattern that can be applied in most languages and frameworks for databases with one primary and multiple read replicas.

In the following diagram, the app is running one Machine in each of three regions. The primary region is Chicago, and this is where the read/write primary database resides. There are Machines in two other regions, Rio de Janeiro and Amsterdam, each of which has a read replica. This example uses three regions for simplicity, but you could deploy in more than three regions and have more than one Machine per region connecting to the same read replica.

<figure>
  <img src="/static/images/docs-fly-replay.png" alt="Three Machines with attached databases in 3 regions: Chicago is the primary region with a writable database, while Rio de Janeiro and Amsterdam have read only replica databases. Arrows pointing from the secondary Machines to the primary Machine show the direction of HTTP requests redelivered using the fly-replay response header. Arrows pointing from the primary database to the read replicas indicate syncing of data.">
</figure>

<div class="note">
**Note:** To illustrate the `fly-replay` concept in our diagram, we show the replayed HTTP request going directly from Machines in Rio de Janeiro and Amsterdam to the Machine in Chicago. In real life, Fly Proxy routes the request back through an edge node first. The cost of this routing is small, but if extreme efficiency is important for your use case, you can run your app in more regions to mitigate that.
</div>

Your app is running on Fly.io. The database can also run on Fly.io—in which case the app and database regions will match—or on another provider where you can pick the region closest to the Fly.io region of your Machines.

## How to make it work for your app

Your app needs logic to:

1. **Read from the corresponding regional replica (or primary!) when a Machine receives a read request.** 
1. **Always replay write requests to the primary region rather than connecting to the primary database from another region.**

### Read from the corresponding regional replica

Your app has a configurable primary region and you'll also host your primary database there or, in the case of a separate database provider, as close as possible to it. The primary region is exposed in the `PRIMARY_REGION` environment variable on every Machine in your app.

Each Machine exposes the region in which it's running in the `FLY_REGION` environment variable.

Your app can check the `FLY_REGION` against the `PRIMARY_REGION`, and modify the `DATABASE_URL`, `DB_HOST`, or other database variables when the region codes don't match. In some cases this just means changing a port ([as for Postgres](/docs/postgres/advanced-guides/high-availability-and-global-replication/#connecting-to-read-replicas)) and in other cases it will be more complex if the database requires different variables for each read replica (like in this [Laravel example](/laravel-bytes/multi-region-laravel-with-planetscale/)).

### Replay write requests to the primary region

Your app can detect write requests and send a response with the `fly-replay` header that tells Fly Proxy to replay the whole request to the Fly Machine in the primary region.

#### Detect write requests

First, you'll need a way to detect write requests so that you can forward them to the primary database. How you detect write requests will depend on your app and database. With Postgres databases, probably the simplest way to detect write requests is by [catching “read only transaction” errors](/docs/postgres/advanced-guides/high-availability-and-global-replication/#detecting-write-requests) when you attempt to write to a read replica.

You can also set up routes in middleware if your language provides support for splitting read and write connections. Or your app can handle GET, POST, DELETE, PUT, and PATCH requests differently, again likely in your app's middleware. For example, assuming HTTP requests using GET are read requests and everything else is a write request will work well most of the time.

#### Send a response with the fly-replay header

When your app detects a write request, it should send a response that contains only the `fly-replay` header with the [region code](/docs/reference/regions/) of your primary region like so: `fly-replay: region=<region code or env variable>`. Fly Proxy will replay the whole request to the specified region. The code would look something like this:

```yaml
# This code should be in the handler for non-GET requests to the endpoint you 
# want to send to the primary region for write to the primary database.
if os.environ("PRIMARY_REGION") != os.environ("FLY_REGION"):
  # This machine is not in the primary region
  response.headers = {"fly-replay": f"region={os.environ("PRIMARY_REGION")}"}
  return response
else:
  # This machine *is* in the primary region
  # Handle request normally, write to database.
```

## Challenges and limitations

### Write-heavy apps shouldn't use read replicas

Don't use regional read replicas if your app's requests are more than 50% write requests. In that case, you'd want to look into a multi-region primary or similar solution.

### Reading your own writes

There will be short periods of time when data is not consistent between replicas and the primary. If reading your own writes immediately is a requirement for your app, then you'll need to consider how to handle replication.

You can set up health checks to monitor replication status and fail when replication is not complete.

Another useful pattern is to poll the database until the data is replicated. The Fly Postgres [LSN module](https://github.com/superfly/fly_postgres_elixir/tree/main/lib/lsn+external) has an example of how to poll with a [Postgres stored procedure](https://github.com/superfly/fly_postgres_elixir/blob/main/lib/migrations/v01.ex+external). You can reuse this pattern from any database library.

A less efficient method would be for your app to catch the errors thrown when records don't exist and then retry failed requests.

## Implementation resources

Example implementations of this multi-region database with `fly-replay` pattern can give you a head start:

- [Fly Ruby gem](https://github.com/superfly/fly-ruby+external) for running database replicas alongside your app instances in multiple regions.
- [Fly Postgres Elixir library](https://github.com/superfly/fly_postgres_elixir+external) for geographically distributed Elixir applications using Ecto and PostgreSQL in a primary/replica configuration on Fly.io.

## Read more

We've covered multi-region databases with `fly-replay` in some past blog posts and in our docs:

- [Globally Distributed Postgres](https://fly.io/blog/globally-distributed-postgres/)

- [Multi-Region Laravel with PlanetScale](https://fly.io/laravel-bytes/multi-region-laravel-with-planetscale/)

- [Run Ordinary Rails Apps Globally](https://fly.io/ruby-dispatch/run-ordinary-rails-apps-globally/)

- [Dynamic Request Routing](/docs/networking/dynamic-request-routing/) docs
