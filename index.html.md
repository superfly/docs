---
title: Fly.io Docs
layout: docs
sitemap: false
nav: firecracker
---

<figure>
  <img src="/public/images/docs-intro.jpg" srcset="/public/images/docs-intro@2x.jpg 2x" alt="Five violet hot-air balloons arrayed before a reddish sunset with, wispy clouds and a small crescent moon.">
</figure>

**Fly.io is a global application delivery network. We run fleets of servers that turn your code into virtual machines running close to your users around the world. We are here for two things: low latency and great DX.**

We run bare-metal servers in 23 regions [around the world](/docs/reference/regions/), and counting. Putting your apps right next to your users makes them respond faster, and we're all-in on bringing your apps to hardware in more parts of the world. 

But we also want to be the best place to run your full stack, wherever you run it&mdash;be it a simple web service or your database-backed opus with multiple supporting services. 

Our [Platform Features]() page tries to quantify some of the factors we think are important to that end.

Use a Fly Launcher to create a preconfigured app:
<div class="c-boxes">
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/crystal/">Run a Crystal App</a>
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/deno/">Run a Deno App</a>
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/elixir/">Run an Elixir App</a>
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/golang/">Run a Go App</a>
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/node/">Run a Node App</a>
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/laravel/">Run a Laravel App</a>
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/python/">Run a Python App</a>
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/rails/">Run a Rails App</a>
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/redwood/">Run a Redwood App
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/remix/">Run a Remix App
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/nuxtjs/">Run a NuxtJS App
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/nextjs/">Run a NextJS App
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/ruby/">Run a Ruby App
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/dockerfile/">Run from your Dockerfile
  </div>
  <div style="border: 1px solid grey;  border-radius: 1em; padding: 1em;">
  <a href="/docs/getting-started/static/">Deploy a Static Website
  </div>
</div>



### A single, global internal network

All your apps can talk to each other over a [shared, private, encrypted IPv6 network](/docs/reference/private-networking/), from anywhere in the world.

### DNS-based service discovery

Your web servers, background workers, and databases can [find each other](/docs/reference/private-networking/#discovering-apps-through-dns-on-an-instance) using standard DNS entries.

### Persistent storage everywhere

All Fly regions offer [persistent disks](/docs/reference/volumes/) at [affordable prices](/docs/about/pricing/#persistent-storage-volumes). Keep your caches warm and close to your users. Maybe you won't need a CDN?

### Easy-to-manage Postgres

Create a HA Postgres cluster, as a Fly.io app, [with one command](/docs/reference/postgres/#creating-a-postgres-app). Our CLI tool has [built-in commands](/docs/flyctl/postgres/) to simplify Postgres app management.

### Request replays

_Replay_ `GET` requests in another region using the magical `fly-replay` header. Run fast, global reads from database replicas while keeping writes on primaries. [Learn how this works with PostgreSQL]<a href="/docs/getting-started/multi-region-databases/).

### Open any port you need, TCP or UDP

We place no limits on ports or protocol. We can [terminate TLS](/docs/reference/services/#tls) for you, even if you're running a TCP-only service like a [gRPC server](https://github.com/fly-apps/grpc-service/).

### Automatic TLS certificates

[Hook up your domain to your app](/docs/app-guides/custom-domains-with-fly/) with a few CLI commands. Certificates are renewed automatically.

### Extensive global reach through a single IP address

[See where your Fly.io apps can run](/docs/reference/regions/) on every continent (except Antarctica). Traffic is routed automatically to the closest region via [Anycast](/docs/reference/services/#anycast).

### Free remote builders

Building apps can be a hefty process. We give you free build VMs with persistent storage (for keeping warm caches) and 4GB of memory.

### Free Hosted Metrics

Get a ton of useful metrics automatically via our [hosted Prometheus server](/docs/reference/metrics/). [Expose a Prometheus endpoint](/docs/reference/metrics/#sending-custom-metrics-to-prometheus) to export custom metrics. It's on us.

### Multiprocess apps

Run [multiple process types](https://community.fly.io/t/preview-multi-process-apps-get-your-workers-here/2316) as independent, logical groupings that may scale independently.

### Generous Free Tier

On our [free tier](/docs/about/pricing/#free-allowances) you can run an app, worker and a database, 24/7, with up to 1GB of persistent storage. We won't delete or switch off your apps.

### Connect to your apps

[SSH](/docs/flyctl/ssh/) to all your VMs, including Postgres, Redis - they're just regular apps. Proxy local ports to remote VMs, or set  up a [Wireguard VPN](/docs/reference/private-networking/#private-network-vpn) to get _full network access_ to your entire organization.


<style>

.c-boxes {
  display: grid; 
  gap: 1em;
  grid-template-columns: repeat(5, 1fr);
}

</style>