---
title: Resilient apps use multiple Machines
layout: docs
nav: guides
date: 2025-09-12
---

<figure>
  <img src="/static/images/resilient-apps.png" alt="Illustration by Annie Ruygt of an armoured truck with a Fly balloon logo" class="w-full max-w-lg mx-auto">
</figure>

<div class="callout">
**Fly Machines are fast-launching VMs, the basic compute unit of the Fly.io platform. Each Machine runs on a single physical host. If that host fails, the Machine goes down and does not automatically start again on another host.**
</div>

To make your app resilient to single-host failure, create at least two Machines per app or process. Fly Proxy autostop/autostart and standby Machines are built-in platform features that you can use to start extra Machines only when needed.

---

## Resiliency: Why and When

Why resiliency? Machines are great until they aren’t. Hosts fail. Regions go dark. Networks get flaky. If your app only runs on one Machine, any of those failures means downtime. Running more than one Machine, or spreading them across regions, is how you keep the lights on when the infrastructure underneath you stumbles.

### When to use it

If you are building something people rely on, you probably want some resiliency. That includes production apps with paying users, customer-facing services where downtime makes people angry, or global apps that need to respond quickly no matter where users are. Regulations can also push you here if you are required to keep systems up in specific geographies.

### When it might not be worth it

For some apps, downtime just does not matter very much. A side project, a staging environment, or an internal tool might run fine on a single Machine. If the stakes are low, adding extra Machines can be more complexity than you need.

### Performance

Machines are really fast to start and stop. If your app has a lot of users, or bursts of high usage, then the Fly Proxy can load balance requests and automatically stop and start Machines based on traffic to your app. Keep one or more Machines running all the time if your app needs even faster first response times.

### Costs

You pay only for `rootfs` when Machines aren't running, not for CPU and RAM. Machine rootfs is [cheap](/docs/about/pricing/#stopped-fly-machines), like 18 cents a month for an average Elixir app that uses 1.2 GB of rootfs.

---

## Multiple Machines for apps with services

You can add more Machines for Fly Proxy to start and stop as needed, which is great for apps that have built-in replication or that don't share data.

### You get two Machines on first deploy

When you deploy an app for the first time with the `fly launch` or `fly deploy` command, you automatically get two identical Machines for processes that have HTTP/TCP services configured in `fly.toml`. The Machines have autostop/autostart enabled so that Fly Proxy can start and stop them based on traffic to your app. You'll also get this default redundant Machine when you `fly deploy` after scaling to zero.

<div class="important icon">
**Volumes:** You'll only get one Machine with `fly launch` for processes or apps with volumes mounted. Volumes don't automatically replicate your data for you, so you'll need to set that up before intentionally creating more Machines with volumes.
</div>

### Add more Machines yourself

If your app doesn't already have multiple Machines with autostop/autostart configured, then you can set it up yourself. You can create any number of Machines to both meet user demand and provide redundancy against host failures.

#### 1. Set up autostop/autostart

Use [Fly Proxy autostop/autostart](/docs/launch/autostop-autostart/) to automatically stop and start Machines based on traffic. Keep one or more Machines running in your primary region if you want to. Example `fly.toml` config:

```toml
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = "stop" # Fly Proxy stops Machines based on traffic
  auto_start_machines = true # Fly Proxy starts Machines based on traffic 
  min_machines_running = 0 # No. of Machines to keep running in primary region
  [http_service.concurrency]
    type = "requests"
    soft_limit = 200 # Used by Fly Proxy to determine Machine excess capacity
```

Fly Proxy uses the concurrency `soft_limit` to determine if Machines have excess capacity. Learn more about [how Fly Proxy autostop/autostart works](/docs/reference/fly-proxy-autostop-autostart/).

**Using the Machines API:** To add or change the autostop/autostart settings with the Machines API, use the settings in the `services` object of the [Machine config](/docs/machines/api/machines-resource/#machine-config-object-properties) in your `create` or `update` calls.

#### 2. Create more Machines

Create extra Machines, or even just one extra Machine, using flyctl:

```
fly scale count 2
```

Or deploy even more Machines in more than one region:

```
fly scale count 20 --region ams,ewr,gig
```

Learn more about [scaling the number of Machines](/docs/apps/scale-count/).

**Using the Machines API:** To scale the number of Machines with the Machines API, you can "clone" Machines. Get and modify a Machine config and use that config to create new Machines in any region. See the[ Machines resource docs](/docs/machines/api/machines-resource/).

---

## Standby Machines for apps without services

When apps or processes are running tools like cron that don't require local storage or accept external requests, it's common to run only one Machine. Since these Machines don't have services configured, they can't be automatically started and stopped by the Fly Proxy. To add redundancy against host failures for this kind of Machine, use a standby Machine; it stays stopped and ready to take over in case the original Machine becomes unavailable.

Unlike Fly Proxy autostop/autostart, which starts Machines based on app traffic, a standby Machine watches the Machine it's paired to and starts only if that Machine becomes unavailable. Learn more about [standby Machines](/docs/reference/app-availability/#standby-machines-for-process-groups-without-services).

### You get a standby Machine on first deploy

When you deploy an app for the first time with the `fly launch` or `fly deploy` command, you automatically get a standby Machine for processes that don't have services configured in `fly.toml` (and therefore aren't visible to Fly Proxy). That standby Machine is a copy of the original, running Machine. You'll also get this standby Machine when you `fly deploy` after scaling to zero.

### Create a standby Machine yourself

If you don't already have a standby Machine for your worker Machines, then you can create one yourself.

To create a standby Machine that will take over the same tasks when a worker Machine is down, use this one command to clone the worker Machine and make the clone a standby:

```
fly machine clone <worker machine id> --standby-for <worker machine id>
```

**Using the Machines API:** To create a standby Machine with the Machines API, get and modify your worker Machine config and use that config to create a new standby Machine. Specify the standby in the Machine's config object: [config.standbys](/docs/machines/api-machines-resource/#machine-config-object-properties).

### Bonus uses for standby Machines

A standby Machine doesn't need to be a copy of the Machine it's watching. You can configure the standby Machine to run with any image you like when a watched Machine becomes unavailable; you can use it to run a recovery script, trigger alerts, or anything else. You can create a standby Machine for any Machine, including one with services.

To create a standby Machine from a different image:

```
fly machine run <image> --standby-for <machine-id>
```

---

## Scaling to multiple regions

Running multiple Machines in one region protects you from host failures. But entire regions can fail too. Power cuts, network issues, and upstream outages do not happen often, but when they do, every Machine in that region goes down. If your app needs to weather that kind of failure, the next step is spreading out across regions.

### When to use it

Multi-region setups make sense when uptime really matters. That might mean production systems with strict SLAs, customer-facing apps where downtime causes pain, or global services that need to stay responsive close to users. Regulations can also be a factor if you need to keep infrastructure running in specific geographies.

### Example

You can place Machines in more than one region with a single command:

```
fly scale count 6 --region ams,ewr,syd
```

This example runs two Machines in Amsterdam, two in New Jersey, and two in Sydney. Fly Proxy will route users to the closest healthy region.

One important caveat: volumes do not replicate across regions. If your app writes data, you need to think carefully about where that data lives and how it syncs. A common approach is to keep one primary “write” region and treat others as read-only.

### Keep in mind

Multi-region comes with real advantages, but also some trade-offs. Users near your regional Machines will see faster responses, but coordinating data across regions is hard, especially since most apps are not designed for global writes. And while redundancy improves reliability, it also increases your costs: more Machines in more places means more expense, and cross-region traffic can add up quickly.

---

## Summing up

Resiliency builds in layers. At the base, you have a single Machine: cheap, simple, and fragile. Add a second Machine in the same region and you are protected from host failures. Spread Machines across regions and you are resilient to outages that take down an entire site, with the added bonus of faster responses for users around the world.

Each layer improves availability, but it also adds cost and complexity. The right choice depends on what you are building and who is depending on it.

Whatever strategy you choose, practice it. Do not wait for a real outage to find out how your app behaves. Stop a Machine and see if traffic shifts. Kill a region and watch how your data layer responds. A resiliency plan only works if you have rehearsed it enough to trust it.

## Related reading

If you want to dig deeper into how Fly apps stay available and what failure modes to expect, these are good next steps:

- [App availability and resiliency](/docs/apps/app-availability/): An overview of the all features that can make your app more resistant to events like hardware failures or outages.
- [Multi-region with Fly-Replay](/docs/blueprints/multi-region-fly-replay/): How to serve reads close to users and route writes back to a primary region.
- [Machine placement and regional capacity](/docs/machines/guides-examples/machine-placement/): How Fly decides where to place your Machines, how to guide placement yourself, and what happens when a region runs out of capacity.
- [Run Ordinary Rails Apps Globally](/ruby-dispatch/run-ordinary-rails-apps-globally/): Project-level example of Rails distributed across regions with smart routing.
