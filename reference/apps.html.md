---
title: Fly Apps
layout: docs
sitemap: false
nav: firecracker
---
On Fly.io, an "app" groups one or more VM instances into a single administrative entity. It stores information our platform needs in order to run your code in Firecracker VMs and to route your services.

Since we [introduced Fly Machines](/blog/fly-machines/), there are two forms this administrative package can take: Apps V1, for Nomad-orchestrated VMs; and Apps V2, for Machines VMs. 

You don't actually have to think about this. Either you "just want to deploy an app," in which case you'll do something like `fly launch` and get Apps V1 by default, or you'll be [working with Machines](/docs/reference/machines/), and you'll end up with a V2 app for that group of Machines VMs.

## Apps V1

Fly Apps V1 are our original Firecracker apps. Instances of V1 apps are orchestrated using Hashicorp Nomad. Unsurprisingly, a lot of the information we have to store in Apps V1 has to do with specifying jobs for Nomad. 

A single Docker image and VM configuration is associated with each V1 app.

Most of our documentation refers to Apps V1. The flyctl CLI is more mature and full-featured for Apps V1.

## Apps V2

[Fly Machines](/docs/reference/machines/) are Firecracker VMs too, but you can control Machines instances at a much lower level, via their REST API or the flyctl CLI. Nomad is not involved. We need to collect a different set of information around a group of Machines VMs than for those running under Nomad, so it made sense to structure a new kind of app for Machines use cases. Thus, Apps V2. 

Machines within a single V2 app can have different configurations and run different images, so these are no longer intrinsic to the app they belong to. Anycast IPs, certificates, and custom domains are still per-app.

If you want the ability (and the responsibility) to directly start and stop individual VM instances, you should look into Fly Machines, and therefore Apps V2. You give up the orchestration features of our platform and the automatic config of `fly launch` in return for much more flexibility and a fast REST API.

Your organization can have V1 apps and V2 apps on the same private network, running different layers of your full-stack application.

Eventually, all new Fly Apps will be Apps V2, and the Fly.io platform will orchestrate them without Nomad. We're not there yet.