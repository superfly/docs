---
title: "Fly.io reference"
layout: docs
nav: firecracker
---

Quick references for often-used resources like flyctl and `fly.toml`. Or dig a little deeper into Fly.io capabilities and how they work.

## About Fly.io

* [**Architecture**](/docs/reference/architecture/):
A brief overview of how Firecracker VMs, Anycast networking, Fly Proxy, and the backhaul network come together to create Fly.io's infrastructure.

* [**Regions**](/docs/reference/regions/):
The regions around the world where we run servers so your apps can run close to your users.

## Reference docs

* [**flyctl**](/docs/flyctl/):
The Fly CLI reference documentation.

* [**Fly Launch Configuration (fly.toml)**](/docs/reference/configuration/):
The settings for configuring your app in the `fly.toml` configuration file. The Fly Launch configuration includes how the app is built, its volume mounts, network services, and more.

## Working with Fly.io

* [**Fly Apps**](/docs/apps/):
What's a Fly App anyway? The abstraction that holds everything you deploy on Fly.io.

* [**App Availability and Resiliency**](/docs/reference/app-availability):
An overview of the features that can make your app more resistant to events like hardware failures or outages.

* [**Builders**](/docs/reference/builders/):
The different ways you can assemble applications into deployable images for Fly.io.

* [**Load Balancing**](/docs/reference/load-balancing/):
An explanation of how Fly.io's proxy distributes traffic to your application instances based on load, closeness, and concurrency settings.
