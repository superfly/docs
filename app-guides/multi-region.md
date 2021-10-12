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
* add an optional replay/forwarding strategy for requests that write to the database
* discuss alternative globe-native datastores

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

This Fly Postgres app called `global-postgres` is a separate Fly app in our account, so let's link it into our application (say it's called `awesome-app`).

```
fly pg attach --postgres-app global-postgres -a awesome-app
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

This isn't specific to Rails of course — we can do this during the initialisation of any application to generate a local read replica URL from the primary `DATABASE_URL`. The primary `DATABASE_URL` will accept both reads and writes, while the read replicas can only handle reads. 





