---
title: "Run a Global Application on Fly"
layout: docs
sitemap: false
nav: firecracker
author: sudhirj
categories:
  - global
  - multi region
  - postgres
  - redis
date: 2021-10-11
---

Fly's global and seamless network helps you run and scale your application in all the regions where your users are, giving them the best possible experience irrespective of location or regional load. 

This guide will cover running a global application that uses Postgres as a database and Redis as a cache. We'll work with a Ruby on Rails app because of some pre-existing libraries to make things easier, but the same principles apply to other applications in any language or framework. 

## Why run apps globally / multi-region? 
The speed of light is really slow. Seriously. It sounds fast on paper, but it takes over 200 milliseconds to get there and back again between the US and South East Asia. In an age where we choose programming languages like Go, Rust and Elixir that can respond in microseconds, and optimise our database queries to run in single digit milliseconds, all that effort fades into irrelevance if our users live somewhere else. 

If you want your users to have a fast blink-of-an-eye experience (less than 100 millisecond response times), the only way to do that (in this universe) is to run your applications close to them.

There are also operational advantages to running in multiple regions, including easier disaster recovery if one region goes down, the ability to run batch processing, or back-office reporting and analytics workloads on the night-time regions.

## How does Fly make this easy? 
Fly runs servers in over 20 regions across the world, with all these regions listening on a global anycast IP address range — which means that a user request to an app on Fly is automatically routed to the nearest region. If you have an instance of your application running in that region, that request is served right there, or else it's proxied to the nearest region that has your app running. This allows you to configure your application servers to run in as many regions as you want, and Fly will add (and remove) instances of your application to deal with traffic as it increases and decreases. 

Fly also has a managed Postgres offering, helping you set up a highly available PostgreSQL database at any region, with automatically managed read replicas in the other regions that you want to run your application in. 

And on top of all this, Fly offers ephemeral Redis instances to all applications that can be used a fast shared local cache. 

## The Plan
Let's say we have an [existing Rails 6+ app](https://fly.io/docs/getting-started/ruby/), to keep things simple, and we want to set up a global deployment [across](https://fly.io/docs/reference/regions/) the US West Coast (`sjc`), US East Coast (`iad`), EU (`fra`), and South East Asia (`sin`). We'll put our database primary in the middle at `fra`, with read replicas at all the other regions. 

We need to:
* set up the Postgres database and replicas
* set up Redis
* configure our application to run globally
* look at optional request replay/forwarding
* discuss alternative global datastores

### Setting up the database
Getting the Fly managed Postgres database ready is covered in detail in the [reference](https://fly.io/docs/getting-started/multi-region-databases/), but these are the main steps: 

```
fly pg create --name global-postgres --region fra
fly scale count 2 -a global-postgres
```

To create the database in the `fra` region. This will create two volumes there, and two instances will start with automatic failover. Let's now add the replicas:

```
fly volumes create pg_data -a global-postgres --region sjc
fly volumes create pg_data -a global-postgres --region iad
fly volumes create pg_data -a global-postgres --region sin
fly scale count 5 -a global-postgres
```

This adds another 3 data volumes in the replica regions, and bumps up the total number of instances to 5. Fly will make sure that each instance is attached to one volume.

This Fly Postgres app called `global-postgres` is a separate Fly app in our account, so let's link it into our application (let's say it's called `global-app`).

```
fly pg attach --postgres-app global-postgres -a global-app
```

What this does is configure an environment variable on our application called `DATABASE_URL` with the Postgres URL of the primary database. This primary URL will always point to port `5432`. If we just wanted to use the primary database from our application, we would set our `config/database.yml` to look like this:

```
production:
  adapter: postgresql
  url: <%= ENV['DATABASE_URL'] %>
```

This works for writes, but it would be useful for application instances to also be able to access the read replica databases running in their local regions. Rails allows (multiple databases)[https://guides.rubyonrails.org/active_record_multiple_databases.html], which can be configured like this:
```
production:
  primary:
    url: <%= ENV['DATABASE_URL'] %>
    adapter: postgresql
  primary_replica:
	  url: <%= URI.parse(ENV['DATABASE_URL']).tap{|u| u.host = ENV['FLY_REGION'] + '.' + u.host}.tap{|u| u.port = 5433}.to_s %>
    adapter: postgresql
    replica: true
```

We're doing two things to the `DATABASE_URL` to make it a replica URL — we're prepending the `FLY_REGION` to the hostname, and changing the port to 5433: so if the `DATABASE_URL` is `postgres://abc:xyz@global-postgress.fly.dev:5432/db1`, we're generating the replica URL as `postgres://abc:xyz@sjc.global-postgress.fly.dev:5433/db1` - which is the local read replica for the `sjc` region.

This isn't specific to Rails of course — we can do this during the initialisation of any application to generate a local read replica URL from the primary `DATABASE_URL`. The primary `DATABASE_URL` will accept both reads and writes, while the read replicas can only handle reads. Switching between the primary and replica is described in the Rails guide, and for other technology stacks it's usually as simple as maintaining two separate connections / pools and choosing between them as required. 

This operation also sets up a `PRIMARY_REGION` environment variable, which is set to the region that has the primary running in it. We'll use this laster when we talk about replaying requests. 

### Setting up Redis
Fly automatically provisions region-level Redis instances for all applications, which you can access with `FLY_REDIS_CACHE_URL`. So the simplest set up would be to just configure this Redis instance as your application cache using the Rails cache store or your stack's equivalent:

```
config.cache_store = :redis_cache_store, { url: ENV['FLY_REDIS_CACHE_URL' }
```

You can also do global cache invalidation on Fly's Redis system — by issuing the `SELECT 1` Redis command, you can switch to a virtual Redis database that broadcasts the command to all your Redis instances in all regions. Some Redis commands are not supported, though, so see the [guide](https://fly.io/docs/reference/redis/#getting-redis-for-an-application) for more details. 

If you'd like more control over your Redis instance, including persistence, you can always start Redis as a separate internal Fly application — templates to do this are available for [simple local](https://github.com/fly-apps/redis) instances and a [global replicated cache](https://github.com/fly-apps/redis-geo-cache).

### Setting up the application
The first step to setting up an application on Fly is to register it, tell Fly which builder and container to use, and set up the ports and domains it will run on — help with this can be found at the [Getting Started](https://fly.io/docs/getting-started/) section. Let's say we've created an app called `global-app`, we can now configure it to run globally, in the regions that we want:

```
flyctl regions set fra sin sjc iad
flyctl scale count 4
flyctl autoscale standard min=4 max=10
```

This sets up the regions we want as the region list, and tells Fly to start 4 instances. We also tell Fly we want the [standard autoscaling strategy](https://fly.io/docs/reference/scaling/#autoscaling), which combined with the `min=4` will ensure that at least one instance is always running at every one of our regions. The `max=10` tells Fly to add more instances based on demand in whichever region needs it, up to a max of 10 instances. 

This setup makes sure we always have a baseline of instances available in our regions, while being prepared for higher traffic. Fly will automatically scale up and back down in regions where we have increased load. 

### Using Request Replay
One thing to remember with a replicated database is that writes can still only happen on a single region, the one where the primary instance resides. This means that if your application tries to write from an instance running on the other side of the world into the primary, query latency can be a problem — especially if there are many queries in sequence. 

In cases like this Fly has a special feature that allows you to replay a request on a different region, so if we receive a request on a region far away from the primary, and we know we want to do a lot of writes, we can ask the Fly proxy layer to replay the request on the primary region instead. In our case, we may want to response with the `fly-replay: region=fra` header any time we receive a request on a non-primary region. Fly makes it easy to distinguish this as well — if the `PRIMARY_REGION` environment variable isn't the same as the `FLY_REGION` variable (which is where we're currently running), we can replay the request on the primary region. There's more information at the ["Running Ordinary Rails Apps Globally"](https://fly.io/blog/run-ordinary-rails-apps-globally/) post as well.

There are libraries available to make this easier on [Ruby](https://github.com/superfly/fly-ruby) and [Elixir](https://hex.pm/packages/fly_postgres), more middleware libraries can be requested on the [Fly Community Forum](https://community.fly.io/).

### Alternate Globe-Native Datastores
With a growing number of apps that have worldwide audiences, more and more databases are also being released with global replication built-in, often with the ability to write in any region as well. [AWS DynamoDB Global Tables](https://aws.amazon.com/dynamodb/global-tables/), [Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction) and [Google Cloud Spanner](https://cloud.google.com/spanner) are specially built for global service, while other services like [AWS Aurora Global Database](https://aws.amazon.com/rds/aurora/global-database/) adapt MySQL and Postgres to work better across regions. All of these will work great with a Fly app running in multiple regions.
