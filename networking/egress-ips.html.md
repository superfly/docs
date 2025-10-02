---
title: "Egress IP addresses"
layout: docs
nav: firecracker
author: kcmartin
date: 2025-10-02
---

## Overview

- By default, outbound (egress) IPs from Fly Machines are **unstable** and may change.
- You can allocate **static egress IPs** per machine (both IPv4 and IPv6) via `fly machine egress-ip`.
- Static egress IPs come with trade-offs: cost, binding to machine lifecycle, and deployment quirks.
- A common workaround is to front outbound traffic through a **proxy** app that _does_ have static egress IPs.
- App-scoped egress IPs are in development and may simplify this in the future.

---

## Why Egress IPs Matter

Some external services—APIs, databases, payment providers—require allowlisting source IPs. Without static egress IPs, outbound IPs from Fly machines may change due to machine lifecycle or infrastructure changes.

- Machines often egress over IPv6 when the destination has an AAAA record and the application prefers it. For example, `curl` will try IPv6 first if available, then fall back to IPv4 if needed. Fly doesn’t force IPv6, but many apps will use it when it's available. 
- IPv4 traffic is NAT'd and may vary. This means the source IP address is rewritten by the host, and which IP you get can change depending on where the machine runs or is restarted.
- You need static egress if you're allowlisting IPs with third-party services.

---

## Static Egress IPs (Machine-Scoped)

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

Static egress IPs are **per-machine**, not per-app.

- IPs are released when a machine is destroyed.
- IPs don’t automatically transfer across deploys.
- Blue/green deployments will replace machines—and their IPs.
- Deployment-time jobs may bypass egress routing.
- Extra latency and connectivity issues are possible in some regions.

<div class="callout">
Static egress IPs are billed per hour per machine.
</div>

---

## The Proxy Pattern

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
- Prefer the proxy pattern for maintainability.
- Test connectivity after assigning egress IPs.
- Avoid destroying machines unnecessarily.
- Monitor for failures during deploy-time migrations.

---

## Future Work

App-scoped egress IPs are in development. These will simplify routing and avoid per-machine binding.

Until then, static IPs and proxy patterns remain the best tools available.

