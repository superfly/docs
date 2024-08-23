---
title: "Fly.io reference"
layout: docs
nav: firecracker
---

Quick references for often-used resources like flyctl and `fly.toml`. Or dig a little deeper into Fly.io capabilities and how they work.

## About Fly.io

* **[Architecture](/docs/reference/architecture/):** A brief overview of how Firecracker VMs, Anycast networking, Fly Proxy, and the backhaul network come together to create Fly.io's infrastructure.

* **[Regions](/docs/reference/regions/):** The regions around the world where we run servers so your apps can run close to your users.

* **[Machine migration](/docs/reference/machine-migration/):** How Fly.io automatically migrates your app's Machines from problematic hosts to healthy hosts.

---

## Reference docs

* **[flyctl](/docs/flyctl/):** The flyctl CLI reference documentation.

* **[App Configuration (fly.toml)](/docs/reference/configuration/):** The settings for configuring your app in the `fly.toml` configuration file. The app configuration includes how the app is built, its volume mounts, network services, and more.

* **[Fly Launch](/docs/reference/fly-launch/):** A deeper dive into how Fly Launch creates and configures new apps.

* **[Fly Proxy](/docs/reference/fly-proxy/):** Learn about how Fly Proxy routes requests, handles connections, and does load balancing.

* **[Fly Proxy autostop/autostart](/docs/reference/fly-proxy-autostop-autostart/):** Learn how Fly Proxy determines excess capacity for an app to shut down or suspend Machines when they're not needed and start them back up when there's traffic.

---

## Working with Fly.io

* **[Autoscaling](/docs/reference/autoscaling/):** Adjust the number of running or created Fly Machines dynamically.

* **[Builders](/docs/reference/builders/):** The different ways you can assemble applications into deployable images for Fly.io.

* **[Load Balancing](/docs/reference/load-balancing/):** How Fly Proxy distributes traffic to your application instances based on load, closeness, and concurrency settings.

* **[Multiple processes inside a Fly.io app](/docs/app-guides/multiple-processes/):** The different ways to run multiple processes inside a Fly App.
