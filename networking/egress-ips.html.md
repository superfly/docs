---
title: "Egress IP addresses"
layout: docs
nav: firecracker
author: kcmartin
date: 2025-10-02
---

## Overview

- By default, outbound (egress) IPs from Fly Machines are **unstable** and may change.
- You can allocate **static egress IPs** for an app (both IPv4 and IPv6) via `fly ips allocate-egress`.
- App-scoped Static egress IPs are per-region: you need one for every region where you have machines.
- Static egress IPs come with trade-offs: cost, concurrent machines / connections.
- Legacy machine-scoped static egress IPs are still availble, but no longer recommended due to their limitations and quirks.

---

## Why Egress IPs Matter

Some external services—APIs, databases, payment providers—require allowlisting source IPs. Without static egress IPs, outbound IPs from Fly machines may change due to machine lifecycle or infrastructure changes.

- Machines often egress over IPv6 when the destination has an AAAA record and the application prefers it. For example, `curl` will try IPv6 first if available, then fall back to IPv4 if needed. Fly doesn’t force IPv6, but many apps will use it when it's available. 
- IPv4 traffic is NAT'd and may vary. This means the source IP address is rewritten by the host, and which IP you get can change depending on where the machine runs or is restarted.
- You need static egress if you're allowlisting IPs with third-party services.

---

## Static Egress IPs (App-Scoped)

App-scoped static egress IPs can be shared between multiple machines in a region belonging to the same app, and will not be deleted when machines are recreated. They are recommended over our legacy, machine-scoped static egress IPs.

### Allocate an App-scoped Static Egress IP

```bash
fly ips allocate-egress --app <app-name> -r <region>
```

This allocates a pair of static egress IPv4 and IPv6 for your app in a region.

If your app has Machines in multiple regions, you must allocate at least 1 app-scoped static egress IP address __per region__.
Only machines located in the same region can use static egress IPs allocated in the region.

<div class="note icon">
You can allocate multiple pairs of static egress IPv4 and IPv6 in the same region. Machines will randomly choose a pair from all static Egress IPs available in the region.
</div>

### View and Manage

```bash
fly ips list
fly ips release-egress <ip-address>
```

### Billing

Each app-scoped static egress IPv4 cost $3.60/mo, billed hourly. IPv6 is currently free, but must be allocated along with an IPv4.

### Caveats

- Each static egress IP can support up to 64 Machines. If you need more than 64 Machines in one region, you will need to allocate multiple static egress IPs.
- When using App-scoped static egress IPs, a Machine can make up to 1000 connections to _each_ external IP address. There is no limit on the _total_ number of concurrent connections.
  - We do not expect this to be a concern for most apps. However, feel free to talk to us if this limits your use case!
- When you have multiple static egress IPs assigned in one region, there is currently no way to specify exactly which IP each machine will use.
- When new machines are created, there might be a brief window when an app-scoped egress IP is not applied to the machine. This may happen more often with more machines or during bluegreen deployment. Allocating multiple pairs of static egress IPs alleviates the issue.

---

## Static Egress IPs (Machine-Scoped)

<div class="warning icon">
Machine-scoped static egress IPs are considered a legacy feature and may be removed in the future. This section is kept for reference purposes only. New apps should use [app-scoped static egress IPs](#static-egress-ips-app-scoped).
</div>

### Allocate a Static Egress IP

```bash
fly machine egress-ip allocate <machine-id> --app <app-name>
```

- This assigns a stable IPv4 + IPv6 pair to the specified machine.

### View and Manage

```bash
fly machine egress-ip list --app <app-name>
fly machine egress-ip release <machine-id> --app <app-name>
```

### Caveats

Because legacy static egress IPs are **per-machine**, not per-app:

- IPs are released when a machine is destroyed.
- IPs don’t automatically transfer across deploys.
- Blue/green deployments will replace machines—and their IPs.
- Deployment-time jobs may bypass egress routing.
- Extra latency and connectivity issues are possible in some regions.

<div class="callout">
Machine-scoped static egress IPs are billed per hour per machine.
</div>

---

## The Proxy Pattern (for Machine-Scoped Static Egress IPs)

<div class="warning icon">
This section only applies to existing apps using machine-scoped static egress IPs. New apps should use [app-scoped static egress IPs](#static-egress-ips-app-scoped) instead.
</div>

To avoid assigning static IPs to every machine, route traffic through a shared proxy app.

### How It Works

1. Deploy a small Fly app (e.g. `egress-proxy`) with static egress IPs.
1. Run a forward HTTP/HTTPS proxy on it.
1. Set `http_proxy` / `https_proxy` env vars in consuming apps.
1. Outbound traffic from those apps will route through the proxy.

### Benefits

- Fewer IPs to manage.
- Primary app machines can be ephemeral.
- Centralize allowlisting.

### Downsides

- Primarily supports HTTP/S traffic. Other protocols (like raw TCP or Postgres) may be possible with extra work, such as using SOCKS5 proxies, `haproxy` in TCP mode, or `socat`, but those setups are more complex and outside the scope of this guide. 
- Adds some latency (~100ms typical).
- Requires maintaining a separate proxy app.

<div class="callout">
Example implementation: [fly-apps/fly-fixed-egress-ip-proxy](https://github.com/fly-apps/fly-fixed-egress-ip-proxy)
</div>

---

## Best Practices

- Use static egress only when required.
- Test connectivity after assigning egress IPs.
- Monitor for failures during deploy-time migrations.