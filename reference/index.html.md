---
title: "Fly Reference Guide"
layout: docs
sitemap: false
nav: firecracker
---

In the Fly Reference Section, you will find the definitive documentation for Fly features and Fly tools.

## _About Fly_

* [**Architecture**](/docs/reference/architecture/): 
A detailed view of Fly's implementation of Firecracker VMs, Scaling, Anycast networking, Proxies, and the Backhaul network, all of which come together to create Fly's infrastructure.

* [**Regions**](/docs/reference/regions/):
Fly's global locations are listed here so you can stay up to date with the expanding list.


## _Creating and Deploying Applications_

* [**App Configuration (fly.toml)**](/docs/reference/configuration/):
Each App on Fly.io has a configuration file called `fly.toml` which determines how the App is built, how its networking is configured, how the App scales and more. This section covers all the settings you can use.

* [**Builders**](/docs/reference/builders/): 
Fly supports multiple ways of assembling applications into deployable images. These are the builders and this section covers the four builders that currently exist on Fly.

* [**Load Balancing**](/docs/reference/load-balancing/):
Fly distributes traffic to your application instances based on load and closeness. This section describes how Fly does that and the configuration that informs load balancing.

* [**Runtime Environment**](/docs/reference/runtime-environment/):
This section covers the environment variables set when an App runs on Fly and the request headers which provide Apps with information about incoming connections.

* [**Scaling**](/docs/reference/scaling/):
Fly is able to scale an App in various dimensions. This section looks at each and how to configure them for your App.

* [**Secrets**](/docs/reference/secrets/):
Every App has a store for secrets. The secrets are exported to the running App through environment variables. Learn how to set and use secrets in this section and find out how they work with deployments to help secure your App.

## _Network Services_

* [**Public Networking**](/docs/reference/services/):
This section looks at Fly's networking and its support for IPv4 and IPv6 addresses via Anycast, automated TLS and HTTP middleware, proxies, and TCP passthrough.

* [**Private Networking**](/docs/reference/private-networking/):
Fly's Private Networking provides secure connections between your applications and a VPN option that allows you to connect into your Fly organization and do the same from your desktop or mobile device. It uses WireGuard and DNS to provide connectivity and discoverability. Find out how to use it in your applications, and how to install and configure the VPN in this section.

* [**Redis**](/docs/reference/redis/):
The Redis key/value store is integrated into the Fly infrastructure and this section covers how you can access it to enable hashing and caching.
