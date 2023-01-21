---
title: "Fly.io Reference Guide"
layout: docs
sitemap: false
nav: firecracker
---

In the Fly.io Reference Section, you will find the definitive documentation for Fly.io features and tools.

## About Fly.io

* [**Architecture**](/docs/reference/architecture/): 
A detailed view of Fly.io's implementation of Firecracker VMs, Scaling, Anycast networking, Proxies, and the Backhaul network, all of which come together to create Fly.io's infrastructure.

* [**Regions**](/docs/reference/regions/):
We run servers around the word so your apps can run close to your users.

## Creating and Deploying Applications

* [**App Configuration (fly.toml)**](/docs/reference/configuration/):
Each App on Fly.io has a configuration file called `fly.toml` which determines how the App is built, how its networking is configured, how the App scales and more. This section covers all the settings you can use.

* [**Builders**](/docs/reference/builders/): 
Fly.io supports multiple ways of assembling applications into deployable images. This section covers the four builders that currently exist on Fly.io.

* [**Load Balancing**](/docs/reference/load-balancing/):
Fly.io's proxy distributes traffic to your application instances based on load and closeness. This section discusses Fly.io's load balancing and the configuration that informs it.

* [**Runtime Environment**](/docs/reference/runtime-environment/):
This section covers the environment variables set when an App runs on Fly.io and the request headers which provide Apps with information about incoming connections.

* [**Scaling**](/docs/reference/scaling/):
Fly.io is able to scale an App in various dimensions. This section looks at each and how to configure them for your App.

* [**Secrets**](/docs/reference/secrets/):
Every App has a store for secrets. The secrets are exported to the running App through environment variables. Learn how to set and use secrets in this section and find out how they work with deployments to help secure your App.

## _Network Services_

* [**Public Networking**](/docs/reference/services/):
This section looks at Fly.io networking and its support for IPv4 and IPv6 addresses via Anycast, automated TLS and HTTP middleware, proxies, and TCP passthrough.

* [**Private Networking**](/docs/reference/private-networking/):
Fly.io Private Networking provides secure connections between your applications and a VPN option that allows you to connect into your Fly organization and do the same from your desktop or mobile device. It uses WireGuard and DNS to provide connectivity and discoverability. Find out how to use it in your applications, and how to install and configure the VPN in this section.

* [**Redis**](/docs/reference/redis/):
Redis by Upstash is a fully-managed, Redis-compatible database service offering global read replicas for reduced latency in distant regions.
