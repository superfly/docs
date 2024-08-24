---
title: "Fly.io essentials"
layout: docs
nav: firecracker
---

You really can [get an app up and running in just minutes](https://fly.io/speedrun/) on Fly.io.

But if you want to know a bit more about what's what on the Fly.io platform, then read on. You can skip to the [glossary](#fly-io-glossary) for the tl;dr.

Two big concepts to know about how Fly.io works, and one small one: Fly Machines, Fly Launch, and Fly Apps.

## Fly Machines: The basic unit of Doing Stuff on Fly.io

Fly Machines are fast-launching virtual machines (VMs) that are individually runnable and controllable. We build Machines out of the images you give us and we run them where you tell us to.

Machines are the compute on Fly.io,[ our lowest level of orchestration](https://fly.io/blog/carving-the-scheduler-out-of-our-orchestrator/). When you just have to run a VM of a specific size in a specific place, Machines are what you want. If you're thinking about individual VMs, rather than applications comprising groups of VMs, then you're thinking about Machines.

Learn more about [Fly Machines](/docs/machines/).

## Fly Launch: Manage applications built on Fly Machines

Fly Launch is how you manage the whole lifecycle of an application on top of Machines, from starting to scaling to changing and redeploying. If you're not thinking of an individual VM, but rather of an application, like "sandwich-ratings.fly.dev", then you're thinking of Fly Launch.

Fly Launch is our built-from-scratch-for-Fly-Machines orchestrator:

- Create your app with the `fly launch` command. Fly Launch detects your framework and gives you useful defaults.
- Configure your app's deployment and services with the [`fly.toml`](/docs/reference/configuration/) configuration file.
- Deploy your app's Machines as a group with the `fly deploy` command.
- Scale your app's Machines [horizontally](/docs/apps/scale-count/) or [vertically](/docs/apps/scale-machine/) with the `fly scale` command.

Again, Fly Launch is built on Machines: you can use Fly Launch to manage the scale of your application with a single command, or you can interact directly with Machines for fine-grained control.

Learn more about [Fly Launch](/docs/launch/).

## Fly Apps: We're not here to tell you what to build

Fly Apps are how we group Machines on the Fly.io platform. A Fly App can be a web app, or a database, or a bunch of task Machines, or whatever you want to deploy. When we talk about "your app" in our how-to docs, we're talking about a Fly App.

You can manage a Fly App's Machines as a group with Fly Launch features, or you can run and manage individual Machines with the Machines API or with `fly machine` flyctl commands. You can even do all of these things in one Fly App. 

Learn more about [Fly Apps](/docs/apps/overview/).

## Fly.io glossary

**The Fly.io platform**: All the primitives, products, and features that make up the Fly.io public cloud.

**[Fly Apps](/docs/apps/):** The way Machines are grouped for admin and management on the Fly.io platform.

**[Fly GPUs](/docs/gpus/):** Machines, but with GPUs. They boot up with GPU drivers installed and you can run `nvidia-smi` right away.

**[Fly Launch](/docs/launch/):** Our orchestrator that includes some good stuff for app hosting, like the `fly launch` command to get started, `fly.toml` for configuration, the `fly deploy` command to deploy all your app's Machines into new versions/releases, and the `fly scale` command to scale Machines.

**[Fly Machines](/docs/machines/):** [Firecracker microVMs](https://firecracker-microvm.github.io/) that launch quickly in any [region supported by Fly.io](/docs/reference/regions/). A VM, or virtual machine, functions like a physical computer, but is software-based. Multiple VMs can run, completely isolated, on one physical host. If you've deployed an app on Fly.io, then it's running on Fly Machines. There’s a fast [REST API](/docs/machines/api/) to manage Machines, but you can also use flyctl&mdash;the Fly CLI&mdash;to manage everything from the command line. And then there’s Fly Launch, which combines flyctl commands with a shared config to manage your app’s Machines as a group.

**[Fly Volumes](/docs/volumes/):** Local persistent storage for Fly Machines. Every Fly Volume can be attached to one Machine at a time and belongs to one Fly App.

**Organizations**: Administrative entities on Fly.io that let you to manage billing, control access by adding and removing members, and share app development environments.
