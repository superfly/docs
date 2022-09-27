---
title: Fly Apps
layout: docs
sitemap: false
nav: firecracker
---
On Fly.io, an "app" groups one or more VM instances into a single administrative entity. It stores information our platform needs in order to run your code in Firecracker VMs and to route your services.

## Apps V1

When you run `fly launch`, you create a new app of a type we are going to start calling Fly Apps V1.

Fly Apps V1 are our original Firecracker apps. Instances of V1 apps are orchestrated using Hashicorp Nomad. Unsurprisingly, a lot of the information we have to store in Apps V1 has to do with specifying jobs for Nomad. A single Docker image and VM configuration is associated with each V1 app.

## Apps V2

[Fly Machines](/docs/reference/machines/) are Firecracker VMs too, but you control machine instances at a much lower level, via their REST API or the flyctl CLI. We need to collect a different set of information around a group of Machines VMs than for those running under Nomad, thus the need for a new kind of app: Apps V2. Machines within a single V2 app can have different configurations and run different images, so these are no longer intrinsic to the app they belong to. Anycast IPs, certificates, and custom domains are still per-app.

## Choosing between Apps V1 and Apps V2

Eventually, all new apps on Fly.io will be Apps V2, but we're not there yet.

If you "just want to deploy an app", you want Apps V1 at this time. That's what you'll get using `fly launch` and most of our documentation refers to this kind of app. The flyctl CLI is more mature and full-featured for Apps V1.

If you want the ability (and the responsibility) to directly start and stop individual VM instances, you may want Fly Machines, and therefore Apps V2. You give up the orchestration features of our platform and the automatic config of `fly launch` in return for much more flexibility and a fast REST API.

Your organization can have V1 apps and V2 apps on the same private network, running different layers of your full-stack application.