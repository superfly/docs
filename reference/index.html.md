---
title: "Fly.io Reference Guide"
layout: docs
sitemap: false
nav: firecracker
---

In the Fly.io Reference Section, you will find the definitive documentation for Fly.io features and tools.

## About Fly.io

* [**Architecture**](/docs/reference/architecture/):
The details about our implementation of Firecracker VMs, Anycast networking, Fly Proxy, and the backhaul network, all of which come together to create Fly.io's infrastructure.

* [**Regions**](/docs/reference/regions/):
The regions around the world where we run servers so your apps can run close to your users.

## Creating and deploying applications

* [**Fly Launch Configuration (fly.toml)**](/docs/reference/configuration/):
The settings for configuring your App in the `fly.toml` configuration file. The Fly Launch configuration includes how the App is built, how its networking is configured, how it scales, and more.

* [**App Availability and Resiliency**](/docs/reference/app-availability):
An overview of the features that can make your app more resistant to events like hardware failures or outages.

* [**Builders**](/docs/reference/builders/):
The different ways you can assemble applications into deployable images for Fly.io.

* [**fly launch**](/docs/reference/fly-launch/):
The command that creates an app and does a lot of the work for you.

* [**flyctl**](/docs/flyctl/):
The Fly CLI reference documentation.

* [**Load Balancing**](/docs/reference/load-balancing/):
An explanation of how Fly.io's proxy distributes traffic to your application instances based on load, closeness, and concurrency settings.

* [**Monorepo and Multi-Environment Deployments**](/docs/reference/monorepo/):
The command options you can use with flyctl to build and deploy multiple apps from a monorepo or deploy an app to multiple targets.

* [**Runtime Environment**](/docs/reference/runtime-environment/):
The environment variables that are set when an App runs on Fly.io and the request headers which provide Apps with information about incoming connections.

* [**Secrets - Build time**](/docs/reference/build-secrets/):
How to set and use Docker secrets to make secrets available at build time.

* [**Secrets - Runtime**](/docs/reference/secrets/):
How to set and use secrets, which are exported to the running App through environment variables, and find out how they work with deployments to help secure your App.

## Learning about the Fly Platform

* [**Fly Apps**](/docs/reference/apps):
The difference between V1 (Nomad) Apps and V2 Apps.

* [**Machines**](/docs/machines):
A brief overview of Fly Machines, the building blocks of the Fly Platform, as well as the Machines API reference, examples, and guides.

* [**Metrics**](/docs/reference/metrics):
The fully-managed metrics that you can access for your app on Fly.io.

* [**Volumes**](/docs/reference/volumes):
The Fly.io implementation of volumes for persistent storage attached to Machines, and the things to consider before using them.

## Network services

* [**Dynamic request routing**](/docs/networking/dynamic-request-routing/):
The different response headers you can use to dynamically route requests to other regions or apps.

* [**Public Networking**](/docs/networking/services/):
Learn about Fly.io networking and its support for IPv4 and IPv6 addresses via Anycast, automated TLS and HTTP middleware, proxies, and TCP passthrough.

* [**Private Networking**](/docs/networking/private-networking/):
How Fly.io Private Networking provides secure connections between your applications and a VPN option that allows you to connect into your Fly organization and do the same from your desktop or mobile device. It uses WireGuard and DNS to provide connectivity and discoverability. Find out how to use it in your applications, and how to install and configure the VPN.

* [**Upstash for Redis**](/docs/reference/redis/):
The fully-managed, Redis-compatible database service that offers global read replicas for reduced latency in distant regions.

## Security

For more general information about security, refer to [Security at Fly.io](/docs/about/security/).

* [**Deploy Tokens**](/docs/reference/deploy-tokens/):
An experimental feature to use in place of standard API tokens.

* [**TLS support**](/docs/networking/tls/):
A list of supported cipher suites.


