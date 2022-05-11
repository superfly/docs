---
title: The Fly Global Application Platform
layout: docs
sitemap: false
nav: firecracker
---

<figure>
  <img src="/public/images/docs-intro.jpg" srcset="/public/images/docs-intro@2x.jpg 2x" alt="">
</figure>

Fly.io is a global application distribution platform. We run your code in [Firecracker](https://firecracker-microvm.github.io/) microVMs on servers we run around the world. Reducing latency between your app and your users is one of our *raisons d'&ecirc;tre*. Since [we can't do anything about the speed of light](/blog/all-in-on-sqlite-litestream/#the-light-is-too-damn-slow), we want you to run your full stack close to your users&mdash;whether it's a simple web service or your database-backed opus with multiple supporting services.

We also just want Fly.io to be the _best place_ to run apps. But "best" depends on what's important to you. So here are some things you might want to know about the Fly.io platform.

### Bespoke infrastructure

We run bare metal servers [around the world](https://fly.io/docs/reference/regions/). We're not limited by the region pool, feature set, or cost overhead of cloud providers like AWS or Google.

### VM isolation

We don't run apps as containers. Every app runs in its own snappy, lightweight [Firecracker](https://firecracker-microvm.github.io/) VM for superior isolation and fewer constraints than container-based runtimes.

### A single, global internal network

All your apps can talk to each other over a [shared, private, encrypted IPv6 network](https://fly.io/docs/reference/private-networking/), from anywhere in the world.

### DNS-based service discovery

Your web servers, background workers, and databases can [find each other](https://fly.io/docs/reference/private-networking/#discovering-apps-through-dns-on-an-instance) using standard DNS entries.

### Persistent storage everywhere

All Fly regions offer [persistent disks](https://fly.io/docs/reference/volumes/) at [affordable prices](https://fly.io/docs/about/pricing/#persistent-storage-volumes). Keep your caches warm and close to your users. Maybe you won't need a CDN?

### Easy-to-manage Postgres

Create a HA Postgres cluster, as a Fly.io app, [with one command](/docs/reference/postgres/#creating-a-postgres-app). Our CLI tool has [built-in commands](/docs/flyctl/postgres/) to simplify Postgres app management.

### Request replays

_Replay_ `GET` requests in another region using the magical `fly-replay` header. Run fast, global reads from database replicas while keeping writes on primaries. [Learn how this works with PostgreSQL](https://fly.io/docs/getting-started/multi-region-databases/).

### Open any port you need, TCP or UDP

We place no limits on ports or protocol. We can [terminate TLS](https://fly.io/docs/reference/services/#tls) for you, even if you're running a TCP-only service like a [gRPC server](https://github.com/fly-apps/grpc-service/).

### Automatic TLS certificates

[Hook up your domain to your app](https://fly.io/docs/app-guides/custom-domains-with-fly/) with a few CLI commands. Certificates are renewed automatically.

### Extensive global reach through a single IP address

[See where your Fly.io apps can run](https://fly.io/docs/reference/regions/) on every continent (except Antarctica). Traffic is routed automatically to the closest region via [Anycast](https://fly.io/docs/reference/services/#anycast).

### Free remote builders

Building apps can be a hefty process. We give you free build VMs with persistent storage (for keeping warm caches) and 4GB of memory.

### Free Hosted Metrics

Get a ton of useful metrics automatically via our [hosted Prometheus server](https://fly.io/docs/reference/metrics/). [Expose a Prometheus endpoint](https://fly.io/docs/reference/metrics/#sending-custom-metrics-to-prometheus) to export custom metrics. It's on us.

### Multiprocess apps

Run [multiple process types](https://community.fly.io/t/preview-multi-process-apps-get-your-workers-here/2316) as independent, logical groupings that may scale independently.

### Generous Free Tier

On our [free tier](https://fly.io/docs/about/pricing/#free-allowances) you can run an app, worker and a database, 24/7, with up to 1GB of persistent storage. We won't delete or switch off your apps.

### Connect to your apps

[SSH](https://fly.io/docs/flyctl/ssh/) to all your VMs, including Postgres, Redis - they're just regular apps. Proxy local ports to remote VMs, or set  up a [Wireguard VPN](https://fly.io/docs/reference/private-networking/#private-network-vpn) to get _full network access_ to your entire organization.
