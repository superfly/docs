---
title: Introducing the Fly Global Application Platform
layout: docs
sitemap: false
nav: firecracker
---

<figure class="w:full mb:4">
  <img class="m:0" src="/public/images/docs-intro.jpg" srcset="/public/images/docs-intro@2x.jpg 2x" alt="">
</figure>

Fly is a platform for applications that need to run globally. It runs your code close to users and scales compute in cities where your app is busiest. Write your code, package it into a Docker image, deploy it to Fly's platform and let that do all the work to keep your app snappy.

You can go hands-on for free and [launch a container on Fly](/docs/hands-on/start/) or read on.


## _What's the Idea Behind Fly?_

Your need to reduce latency to deliver your applications as fast as physics is our business. The old solution of globally duplicating resources in every datacenter near where customers are isn't sustainable. 

Being location smart, agile over time and clever with the cloud allows us to build a deployment platform that lets you reap the benefits of lower latency for your users wherever they are.

## _What Fly Does_

Modern applications get packaged into containers and can carry with them all the code needed for them to operate. But, more often than not, they are deployed into specific datacenters, never to be moved. This is nothing like a container in the real world. Real containers are built to be transported where there's demand for them. 

With Fly.io, we're more like those real containers, moving around the world to where the demand is.

### Location-Smart
Think of a world where your application appears in the location where it is needed. When a user connects to a Fly application, the system determines the nearest location for the lowest latency and starts the application there. 

And with automatic scaling, as more connections appear, the application is right sized for demand by creating new instances at that location.

### Agile over Time
One of the best indications of demand is time, specifically the time of day - demand increases during the day when people work, and diminishes overnight. 

With Fly, our default is to use that information and let your applications follow the sun, relocating to where the clock shows the day beginning and being ready for the day's demand. If your users behave differently, you can change this behavior and set your own schedules.

### Clever with the Cloud
Fly isn't just the simplest way to create and scale instances in datacenters around the globe. It's also the smartest way to do it. When your users connect to a Fly application, we analyze other nearby locations. 

If it's quicker to route their request transparently to a nearby instance that's already running, we do just that. Data travels between Fly datacenter locations over an encrypted backhaul running on fast connections.

## _How Fly Works For&hellip;_


### For Developers

You can run most applications with a `Dockerfile` using the `flyctl` command. The first time you deploy an app, we assign it a global IP address. By default, apps listen for HTTP and HTTPS connections, though they can be [configured](/docs/services/) to accept any kind of TCP traffic.

When users connect to your global IPs, we [dynamically assign compute resources](/docs/reference/scaling/) in datacenters closest to them. More users might create demand for more resources in multiple locations worldwide, while low-traffic applications may only require a small amount of resources in a single location.

### For Operations

Fly makes application deployment simple. Global availability and global IP addresses put your applications anywhere with a single command. Automatically generated TLS certficates help secure your applications. 

And once your application is deployed, Fly keeps your performance up by sending users on the shortest, fastest path to where your application is running.


## _Why Fly?_

Compare those Fly features with a traditional non-Fly global cloud. There you create instances of your application at every location where you want low latency. 

Then, as demand grows, you'll end up scaling-up each location because scaling down is tricky and would involve a lot of automation. The likelihood is that you'll end up paying 24/7 for that scaled-up cloud version. Repeat that at every location and it’s a lot to pay for.

## _Why are we Making Fly?_

Despite the benefits of location-smart, time-agile and cloud-clever applications, there’s been no good platform for building applications that work like this. This is what Fly has set out to fix. In the process we want to make application distribution platforms as ubiquitous as CDNs. 

