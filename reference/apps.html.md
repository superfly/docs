---
title: "Fly Apps"
layout: docs
toc: false
nav: firecracker
---

Every customer VM on Fly.io belongs to a Fly App, which owns the information we need to run your code in Firecracker VMs and to route to your services. Anycast IPs, certificates, and custom domains belong to Apps.

Fly Machines are the Firecracker VM building blocks of Fly Apps. 

Deploying a Fly App with `fly deploy` creates or updates one or more Machines as a unit with a single [configuration](/docs/reference/configuration/) and code base. To learn more about configuring and deploying a Fly App, see the [Apps](/docs/apps/) docs.

[Machines](/docs/reference/machines/) can also be created and configured independently using `fly machine run` or controlled with their fast HTTP API for more atomic control. 

At the moment, there are two types of Fly App. 

## Legacy Apps ("Fly Apps V1")

"Fly Apps V1" are our original Firecracker apps. Instances of V1 apps are orchestrated using Hashicorp Nomad. New organizations no longer deploy Fly Apps to the V1 version of the platform, but existing V1 apps are unchanged and can be managed in the same way.

## Apps V2

"Fly Apps V2" is the new version of the Fly Apps Platform, running on [flyd](https://fly.io/blog/carving-the-scheduler-out-of-our-orchestrator/) instead of Nomad.

Apps V2 doesn't behave identically to V1. It's less Nomady. 

At the moment, for example, flyd won't magically move a Machine from one host to another. There's a lot more information about this in [Carving the Scheduler Out of Our Orchestrator](/blog/carving-the-scheduler-out-of-our-orchestrator/).

Machines within a single V2 App can also have different configurations and run different images, if you want. 

Your organization can have V1 apps and V2 apps on the same private network, running different layers of your full-stack application.

Eventually, all new Fly Apps will run on the Apps V2 platform. 