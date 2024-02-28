---
title: "Fly.io reference"
layout: docs
sitemap: false
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

* [**Fly Apps**](/docs/reference/apps/):
What's a Fly App anyway? The abstraction that holds everything you deploy on Fly.io.

* [**App Availability and Resiliency**](/docs/reference/app-availability):
An overview of the features that can make your app more resistant to events like hardware failures or outages.

* [**Builders**](/docs/reference/builders/):
The different ways you can assemble applications into deployable images for Fly.io.

* [**Load Balancing**](/docs/reference/load-balancing/):
An explanation of how Fly.io's proxy distributes traffic to your application instances based on load, closeness, and concurrency settings.

* [**Monorepo and Multi-Environment Deployments**](/docs/reference/monorepo/):
The command options you can use with flyctl to build and deploy multiple apps from a monorepo or deploy an app to multiple targets.

* [**Runtime Environment**](/docs/machines/runtime-environment/):
The environment variables that are set when an App runs on Fly.io and the request headers which provide Apps with information about incoming connections.

* [**Secrets - Build time**](/docs/reference/build-secrets/):
How to set and use Docker secrets to make secrets available at build time.

* [**Secrets - Runtime**](/docs/reference/secrets/):
How to set and use secrets, which are exported to the running App through environment variables, and find out how they work with deployments to help secure your App.

* [**Metrics**](/docs/reference/metrics):
The fully-managed metrics that you can access for your app on Fly.io.

* [**Deploy Tokens**](/docs/reference/deploy-tokens/):
An experimental feature to use in place of standard API tokens.
