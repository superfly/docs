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
Let's say we have an existing Rails 6+ app, to keep things simple, and we want to set up a global deployment [across](https://fly.io/docs/reference/regions/) the US West Coast (`sjc`), US East Coast (`iad`), EU (`fra`), and South East Asia (`sin`). We'll put our database primary in the middle at `fra`, with read replicas at all the other regions. 

We need to:
* set up the database and replicas
* set up the app deployment 
* configure the app to understand the primary and replica databases
* configure the app to use the local Redis instance for caching
* add an optional replay/forwarding strategy for requests that write to the database
* discuss following the sun by changing the region primary region based on time of day
* discuss alternative globe-native datastores



