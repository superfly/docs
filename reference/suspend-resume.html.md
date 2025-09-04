---
title: Machine Suspend and Resume
layout: docs
nav: firecracker
author: kcmartin
date: 2025-08-15
---

**Machine suspend** lets you pause a running Fly Machine and save its complete state, including memory, to persistent storage. When resumed, the machine picks up exactly where it left off, without rebooting the OS or restarting your app. That can make startup take just **hundreds of milliseconds** instead of multiple seconds.

You can think of suspend as what a laptop does when you close the lid, except your “laptop” is a microVM running in, say, `dfw` or `fra` or `syd`.

## How it works

Suspend uses [Firecracker snapshots](https://firecracker-microvm.github.io/) to capture the entire VM state: CPU registers, memory contents, open file handles. When you start a suspended machine, Fly restores from this snapshot instead of cold booting.

**Typical performance:**

- Resume from suspend: a few hundred ms
- Cold start: ~2+ seconds for common apps
- TCP connections may survive if the remote side keeps them open

---

## Using Suspend

### Manually

```bash
# Suspend a machine
fly machine suspend <machine-id>

# Check status (running, suspending, suspended, etc.)
fly machine status <machine-id>

# Resume from snapshot
fly machine start <machine-id>

# Force a cold start (discard snapshot)
fly machine stop <machine-id>
fly machine start <machine-id>
```

### Automatically via Fly Proxy

Configure in `fly.toml`:

```
[http_service]
  auto_stop_machines = "suspend"  # or "stop"
  auto_start_machines = true
  
  [[http_service.concurrency]]
    type = "requests"
    soft_limit = 25
```

The proxy will automatically suspend machines during low traffic, checking for idle periods every few minutes, and resume them when requests arrive.

### Machines API

```
# Suspend
POST /v1/apps/{app_name}/machines/{machine_id}/suspend

# Wait for suspension to complete
GET /v1/apps/{app_name}/machines/{machine_id}/wait?state=suspended

# Resume (standard start endpoint)
POST /v1/apps/{app_name}/machines/{machine_id}/start
```

While usage of the Machines API in general requires an API token, suspending your own machine using the `/.fly/api` Unix socket directly does not:

```bash
$ curl --unix-socket /.fly/api -X POST \
  http://flaps/v1/apps/$FLY_APP_NAME/machines/$FLY_MACHINE_ID/suspend
```

---

## Requirements

A machine can use suspend if it has:

- **≤ 2 GB** memory (For larger memory sizes, suspend is discouraged due to increased suspend times)
- **No** [**swap**](https://fly.io/docs/reference/configuration/#swap_size_mb-option) **configured**
- **No** [**schedule**](https://fly.io/docs/machines/flyctl/fly-machine-run/#start-a-machine-on-a-schedule) **configured** 
- **No GPU configured**
- Been updated since **June 20, 2024 20:00 UTC**

If you have an older machine, or you’re not sure when it was last updated, you can bring it up to date with:

```bash
fly machine update <machine-id> --yes 
```

This updates the machine in place to the latest supported configuration for suspend, without changing your app code or image.

---

## Limitations and considerations

- Suspend is not currently recommended for large machine memory sizes (> 2 GB)
- Suspending many machines at once is not recommended
- Some logs may be lost after resume
- Unlike stop, suspend **does not** reset the machine's `rootfs` 
- On resume, the clock can lag a few seconds until NTP syncs

<div class="callout">
Always design for both resume and cold start paths.
</div>

---

## Snapshot behavior with suspend

<div class="warning icon">
Snapshots are tied to the exact code and state of the machine they were taken from. If you deploy new code, the old snapshot can’t be resumed safely and will be discarded.
</div>

**Snapshots** **aren’t guaranteed to persist.** Cold starts may happen if:

- **You deploy a new version of your app** — deployments rebuild the machine image, which invalidates the old snapshot. Since a snapshot is a literal memory dump of the _old_ process, resuming it after you’ve swapped in new code or dependencies would be unsafe and unpredictable.
- The machine is migrated to a different host
- The snapshot file is lost or corrupted — Hardware failures, space reclamation, or corruption can cause them to be deleted
- We perform system maintenance or updates

---

## Handling Network Connections After Resume

On resume, the machine thinks its network connections are still live. External systems (databases, APIs) may disagree.

Common symptoms:

- `ECONNRESET`
- "Connection closed"
- Timeouts on first request
- Database pool errors

**Fix:** Reconnect on failure.

Example (Python + DB):

```python
try:
    result = db.execute(query)
except (ConnectionError, OperationalError):
    db.reconnect()
    result = db.execute(query)
```

Tips:

- Use connection pools with disconnect handling (see this excellent [SQLAlchemy guide](https://docs.sqlalchemy.org/en/20/core/pooling.html#dealing-with-disconnects))
- Shorten connection timeouts to fail fast
- Use retry/backoff for HTTP clients
- Test after long suspensions

---

## Billing

Suspended machines cost the same as stopped machines: storage only. There are no CPU/RAM charges.

---

## Monitoring & Debugging

```bash
fly machine status <machine-id>
```

States:

- `running`
- `suspending`
- `suspended`
- `starting` (resume or cold start)
- `stopped`

If machines cold start unexpectedly:

- Check requirements
- Confirm no migrations or deployments occurred
- Check logs for suspend/resume events

Test cold start:

```bash
fly machine stop <machine-id>
fly machine start <machine-id>
```

---

## Availability

Suspend works in **all Fly.io regions** as of July 2024.

---

**Related reading:**

- [Autostop & Autostart](/docs/launch/autostop-autostart/)
- [Fly Proxy Config](/docs/reference/fly-proxy-autostop-autostart/)
- [Scaling Machines](/docs/apps/scale-count/)
- [Machines API](https://docs.machines.dev/)
