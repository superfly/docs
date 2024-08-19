---
title: Resilient apps use multiple Machines
layout: docs
nav: firecracker
---

Fly Machines are fast-launching VMs; they're the compute of the Fly.io platform. Every Machine runs on a single physical host. If that host fails, the Machine becomes unavailable; it does not automatically get rescheduled on another host.

To make your app resilient to single-host failure, create at least two Machines per app or process. Fly Proxy autostop/autostart and standby Machines are built-in platform features that you can use to start extra Machines only when needed.

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

**Using the Machines API:** To add or change the autostop/autostart settings with the Machines API, use the settings in the `services` object of the [Machine config](/docs/machines/api/machines-resource/#machine-config-object-properties) in your create or update calls.

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

## Standby Machines for apps without services

When apps or processes are running tools like cron that don't require local storage or accept external requests, it's common to run only one Machine. Since these Machines don't have services configured, they can't be automatically started and stopped by the Fly Proxy. To add redundancy against host failures for this kind of Machine, use a standby Machine; it stays stopped and ready to take over in case the original Machine becomes unavailable.

Unlike Fly Proxy autostop/autostart, which starts Machines based on app traffic, a standby Machine watches the Machine it's paired to and starts only if that Machine becomes unavailable. Learn more about [standby Machines](https://fly.io/docs/reference/app-availability/#standby-machines-for-process-groups-without-services).

### You get a standby Machine on first deploy

When you deploy an app for the first time with the `fly launch` or `fly deploy` command, you automatically get a standby Machine for processes that don't have services configured in `fly.toml` (and therefore aren't visible to Fly Proxy). That standby Machine is a copy of the original, running Machine. You'll also get this standby Machine when you `fly deploy` after scaling to zero.

### Create a standby Machine yourself

If you don't already have a standby Machine for your worker Machines, then you can create one yourself.

To create a standby Machine that will take over the same tasks when a worker Machine is down, use this one command to clone the worker Machine and make the clone a standby:

```
fly machine clone <worker machine id> --standby-for <worker machine id>
```

**Using the Machines API:** To create a standby Machine with the Machines API, get and modify your worker Machine config and use that config to create a new standby Machine. Specify the standby in the Machine's config object: [config.standbys](/docs/machines/api-machines-resource/#machine-config-object-properties).

## Bonus uses for standby Machines

A standby Machine doesn't need to be a copy of the Machine it's watching. You can configure the standby Machine to run with any image you like when a watched Machine becomes unavailable; you can use it to run a recovery script, trigger alerts, or anything else. You can create a standby Machine for any Machine, including one with services.

To create a standby Machine from a different image:

```
fly machine run <image> --standby-for <machine-id>
```

## Benefits and cost of multiple Machines

**Resiliency:** Your app won't fail when a single host fails because another Machine will start up to take over app requests or tasks.

**Performance:** Machines are really fast to start and stop. If your app has a lot of users, or bursts of high usage, then the Fly Proxy can load balance requests and automatically stop and start Machines based on traffic to your app. Keep one or more Machines running all the time if your app needs even faster first response times.

**Cost**: You pay only for rootfs when Machines aren't running, not for CPU and RAM. Machine rootfs is [cheap](/docs/about/pricing/#stopped-fly-machines), like 18 cents a month for an average Elixir app that uses 1.2 GB of rootfs.

## Read more

- [App availability and resiliency](/docs/reference/app-availability/): An overview of the all features that can make your app more resistant to events like hardware failures or outages.
- [Troubleshoot apps when a host is unavailable](/docs/apps/trouble-host-unavailable/): What we hope you won't have to do, because you followed this blueprint and have multiple Machines.
