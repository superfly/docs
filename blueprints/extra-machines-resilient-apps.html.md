---
title: Resilient apps use extra Machines
layout: docs
nav: firecracker
---

Fly Machines are fast-launching VMs; they're the compute of the Fly.io platform. Every Machine is assigned to a single physical host. This helps keep `start` operations consistently fast, but comes at the cost of Machine availability when something goes wrong on a single host.

We have several platform features available to create high availability services with Machines. They all require a second Machine, even if it’s not running most of the time.

Reasons to set up extra Machines:

- Your app won't fail when a single host fails because another Machine will start up to take over app requests or tasks.
- If your app has a lot of users, or bursts of high usage, then the Fly Proxy can load balance requests and automatically stop and start Machines based on traffic to your app. 
- When Machines aren't running, you only pay for rootfs, not CPU and RAM. Rootfs is [cheap](/docs/about/pricing/#stopped-fly-machines), like 18 cents a month for an average Elixir app that uses 1.2 GB of rootfs.

You can add [extra Machines](#extra-machines-for-apps-that-receive-requests) for Fly Proxy to start and stop as needed, which is great for apps that have built-in replication or that don't share data.

For worker Machines that don't accept external requests, [create a standby Machine](#create-a-standby-machine), stopped and ready to take over in case the original Machine becomes unavailable.

## Extra Machines for apps that receive requests

When you deploy an app for the first time with the `fly launch` or `fly deploy` command, you automatically get two identical Machines for processes that accept HTTP/TCP requests (i.e. that run a service). The Machines have auto start and stop enabled so that Fly Proxy can start and stop the Machines based on traffic to your app.

<div class="important icon">
**Volumes:** You'll only get one Machine with `fly launch` for processes or apps with volumes mounted. Volumes don't automatically replicate your data for you, so you'll need to set that up before intentionally creating multiple Machines with volumes.
</div>

If your app doesn't already have multiple Machines with auto start and stop, then you can set it up yourself. You can create any number of Machines to both meet user demand and provide redundancy against host failures.

### 1. Set up auto start and stop

Use auto start and stop to tell the Fly Proxy to start and stop Machines based on traffic. Keep one or more Machines running in your primary region if you want to. Example from `fly.toml` config:

```toml
[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true # Fly Proxy stops Machines based on traffic
  auto_start_machines = true # Fly Proxy starts Machines based on traffic 
  min_machines_running = 0 # No. of Machines to keep running in primary region
  [http_service.concurrency]
    type = "requests"
    soft_limit = 200 # Used by Fly Proxy to determine Machine excess capacity
    hard_limit = 250
```

Fly Proxy uses the concurrency `soft_limit` to determine if Machines have capacity. Learn more about [auto start and stop](/docs/apps/autostart-stop/).

**Using the Machines API:** To add or modify the auto start and stop settings with the Machines API, create or update the settings in the `services` object of the [Machine config](/docs/machines/api/machines-resource/#machine-config-object-properties).

### 2. Create more Machines

Create extra Machines, or even just one extra Machine, using flyctl:

```
fly scale count 2
```

Or deploy even more Machines in more than one region:

```
fly scale count 20 --region ams,ewr,gig
```

Learn more about [scaling the number of Machines](/docs/apps/scale-count/).

**Using the Machines API:** To scale the number of Machines with the Machines API, you can "clone" Machines. Get and modify your Machine config and use that config to create new Machines in any region. See the[ Machines resource docs](/docs/machines/api/machines-resource/).

## Standby Machines for apps that don't accept requests

When apps or processes are running tools like cron that don't require local storage or accept external requests, it's common to run only one Machine. To add redundancy against host failures for this kind of Machine, use a standby Machine.

A standby Machine watches the Machine it's paired to and starts only if that Machine becomes unavailable.

When you deploy an app for the first time with the `fly launch` or `fly deploy` command, you automatically get a standby Machine for processes that don't accept HTTP requests (and therefore aren't visible to Fly Proxy). That standby Machine is a copy of the original, running Machine.

If you don't already have a standby Machine for your worker Machines, then you can create one yourself.

### Create a standby Machine

To create a standby Machine that will take over the same tasks when a worker Machine is down, you can use this one command to both clone the worker Machine and make the clone a standby Machine:

```
fly machine clone <worker machine id> --standby-for <worker machine id>
```

**Using the Machines API:** To create a standby Machine with the Machines API, you can get and modify your worker Machine config and use that config to create a new standby Machine. The standby is specified in the Machine's config object: [config.standbys](/docs/machines/api-machines-resource/#machine-config-object-properties).

## Bonus uses for standby Machines

A standby Machine doesn't need to be a copy of the Machine it's watching. It can be configured to run with any image you like when a watched Machine becomes unavailable. The standby Machine could run a recovery script, trigger alerts, or anything else.

To create a standby Machine from a different image:

```
fly machine run <image> --standby-for <machine-id>
```