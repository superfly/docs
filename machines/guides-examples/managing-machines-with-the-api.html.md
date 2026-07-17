---
title: Managing Machines with the Machines API
layout: docs
nav: machines
author: kcmartin
date: 2026-04-06
---

<figure>
  <img src="/static/images/managing-machines-api.png" alt="Illustration by Annie Ruygt of a big book about the Machines API" class="w-full max-w-lg mx-auto">
</figure>

<div class="callout">
**The [Machines resource API](/docs/machines/api/machines-resource/) documents every endpoint. This guide covers the patterns you'll actually need when building on it: cloning machines, keeping them in sync with `flyctl`, configuring services, managing auto-stop/start behavior, and updating config.**
</div>

If you're just deploying an app, use `fly deploy`. This guide is for when you need programmatic control, when you're building a platform, managing machines from your own code, or doing things `flyctl` doesn't support directly.

## Before you begin

You need a Fly.io API token. Set it as an environment variable:

```bash
export FLY_TOKEN=$(fly tokens create deploy -a YOUR_APP)
```

Deploy tokens are scoped to a single app and are the safest option for API access. If you need broader access, for example to manage multiple apps, you can use an org-level token instead. Read more about tokens on [this page](/docs/security/tokens/).

The Machines API base URL is `https://api.machines.dev/v1`. All requests need the `Authorization` header:

```bash
curl -H "Authorization: Bearer $FLY_TOKEN" \
    https://api.machines.dev/v1/apps/YOUR_APP/machines
```

## Create a Machine from an existing one

The most reliable way to create a Machine via the API is to start from an existing Machine's configuration. This is especially useful if you need the new Machine to behave like one created by `fly launch` or `fly deploy`. Those commands set metadata, services, and other config that can be easy to miss if you build the JSON from scratch.

The workflow:

1. **Get the source Machine's config.** Use the API or flyctl:

    ```bash
    # Via API
    curl -H "Authorization: Bearer $FLY_TOKEN" \
        https://api.machines.dev/v1/apps/YOUR_APP/machines/MACHINE_ID

    # Via flyctl
    fly machine status MACHINE_ID --display-config
    ```

1. **Modify the JSON** for your needs — change the region, adjust resources, update environment variables.
1. **Create the new Machine** by POSTing the modified config:

    ```bash
    curl -H "Authorization: Bearer $FLY_TOKEN" \
      -H "Content-Type: application/json" \
      -X POST https://api.machines.dev/v1/apps/YOUR_APP/machines \
      -d @config.json
    ```

You can also use `fly machine run` with command-line flags, but if you're starting from a full JSON config, the API is more straightforward.

## Make API-created Machines visible to flyctl

Machines created directly through the API are "detached" by default if you build the config from scratch or strip the metadata. They exist and run, but `fly deploy` and `fly scale` won't touch them since those commands only manage Machines that belong to a process group. Note that if you create a Machine by copying an existing flyctl-managed Machine's config, the `fly_platform_version` and `fly_process_group` metadata carry over, so the new Machine is automatically part of the process group.

To bring a Machine under flyctl management, set two metadata keys:

- `fly_platform_version`: must be `v2`
- `fly_process_group`: the name of an existing process group (e.g., `app`, `worker`)

With flyctl:

```bash
fly machine update MACHINE_ID \
  --metadata fly_platform_version=v2 \
  --metadata fly_process_group=app
```

Or include the metadata in the Machine config JSON when creating via the API:

```json
{
  "config": {
    "metadata": {
      "fly_platform_version": "v2",
      "fly_process_group": "app"
    }
  }
}
```

Once set, the Machine becomes part of that process group. The next `fly deploy` will update it along with the rest of the group. Note that until the next deploy, the Machine won't show a VERSION in `fly status`.

If you _want_ Machines to stay independent of flyctl — for example, one-off workers or machines managed entirely by your own tooling, then leave the metadata off. Keep in mind that `fly status` will list them as detached.

## Configure services via the API

In `fly.toml`, you define how traffic reaches your app using `[http_service]` or `[[services]]`. The API equivalent is the `services` property in the Machine config.

The services config controls how the Fly proxy routes connections to your Machine: ports, protocols, concurrency limits, and auto-stop/start behavior. Here's a typical example:

```json
{
  "config": {
    "services": [
      {
        "ports": [
          { "port": 443, "handlers": ["tls", "http"] },
          { "port": 80, "handlers": ["http"] }
        ],
        "protocol": "tcp",
        "internal_port": 8080,
        "concurrency": {
          "type": "connections",
          "hard_limit": 25,
          "soft_limit": 20
        },
        "autostop": "suspend",
        "autostart": true,
        "min_machines_running": 1
      }
    ]
  }
}
```

<div class="callout">
**Important:** Within a process group, every Machine must have identical service configuration. The Fly proxy expects consistency: if Machine A accepts connections on port 8080 with a hard limit of 25, and Machine B has different settings, routing behavior becomes unpredictable.
</div>

If you're working from an existing Machine's config (as described above), the services are already there. Modify what you need, but keep them consistent across the group.

## Update a Machine's configuration

The Machines API doesn't support `PATCH` — you can't send just the fields you want to change. Instead, the update flow is:

1. **GET** the full Machine config:

    ```bash
    curl -H "Authorization: Bearer $FLY_TOKEN" \
        https://api.machines.dev/v1/apps/YOUR_APP/machines/MACHINE_ID
    ```
1. **Extract and modify** the `config` object from the response — add a service, change an environment variable, adjust resources.
1. **Wrap and POST** the modified config back. The GET response returns the config nested inside the Machine object, but the POST endpoint expects a `{"config": ...}` wrapper at the top level:

    ```bash
    curl -H "Authorization: Bearer $FLY_TOKEN" \
      -H "Content-Type: application/json" \
      -X POST https://api.machines.dev/v1/apps/YOUR_APP/machines/MACHINE_ID \
      -d @updated-config.json
    ```

    Where `updated-config.json` looks like:

    ```json
    {
      "config": {
          ...your modified config object...
      }
    }
    ```

Always start from a fresh GET. Don't cache old configs and POST them later because another process (or a `fly deploy`) may have changed the Machine's config in the meantime.

**Note:** Updating a Machine's config triggers a stop/start cycle. It's not a hot reload. Plan for brief downtime when updating running Machines.

## Auto-stop, autostart, and suspend

The Fly proxy can automatically stop or suspend idle Machines and restart them when requests arrive. This is configured per-Machine in the `services` property, the API equivalent of `auto_stop_machines` and `auto_start_machines` in `fly.toml`.

The relevant fields in each service entry:

| Field | Values | What it does |
| --- | --- | --- |
| `autostop` | `false`, `true`, `"suspend"` | What happens when the Machine has no traffic and there's excess capacity. `false` disables autostop. `true` stops the Machine (cold start on restart). `"suspend"` suspends the Machine (preserves memory, faster resume). The API also accepts `"off"` and `"stop"` as aliases, but normalizes them to `false` and `true` respectively. |
| `autostart` | `true`, `false` | Whether the proxy boots this Machine when a request arrives and no running Machine can serve it. Must be a boolean — the API rejects string values. |
| `min_machines_running` | integer | Minimum Machines to keep running in the primary region, even when idle |

### How the proxy decides to stop a Machine

The proxy tracks active connections. When a Machine has zero connections and other Machines in the same process group can handle the load, the proxy considers it excess capacity and triggers an autostop. The `concurrency.soft_limit` is the threshold. Once total connections across the group drop low enough that a Machine is unnecessary, it gets stopped or suspended.

Even if a Machine is the only one in its region, it can still be stopped. If it has zero connections and `autostop` is enabled, the proxy will stop or suspend it. It will automatically start again on the next request if `autostart` is enabled.

**Stop vs suspend:** Stopped Machines boot from scratch on restart, so expect a cold start. Suspended Machines preserve memory state and resume faster, but not all workloads support suspend cleanly ([Read more](/docs/getting-started/troubleshooting/#suspend-vs-stop) about common issues like clock skew after resume).

### Keep autostart and autostop in sync

If you enable `autostop` but disable `autostart`, Machines will stop and never come back. Requests will return 503. If you enable `autostart` but disable `autostop`, Machines that get started will stay running indefinitely and never scale back down. In general, set both or neither.

### Long-running background work

This is the most common gotcha. If your Machine receives an HTTP request, spawns a background task, and returns a response immediately, the proxy sees zero active connections and may autostop the Machine, killing the background work. For more information about background workers, check out [this guide](/docs/blueprints/work-queues/).

Approaches that work:

- **Hold the connection open.** Stream progress back to the client or use long-polling so the connection stays active while work runs. The proxy won't stop a Machine with active connections.
- **Disable autostop for workers.** Set `autostop` to `"off"` and have your application call `process.exit()` (or equivalent) when work is complete. You manage the lifecycle; the proxy stays out of it.
- **Use a separate process group.** Run workers as a different process group with `autostop: "off"` while your web-facing Machines use normal autostop. This way cost savings apply to the web tier without affecting background processing.

### Machines without services

If a Machine has no `services` config (no HTTP or TCP services), the Fly proxy doesn't manage it at all. It won't auto-stop or auto-start — it just runs until you stop it via the API, or it exits on its own. Its lifecycle is governed entirely by its [restart policy](/docs/machines/guides-examples/machine-restart-policy/).

This is the right setup for cron-style jobs, queue workers that poll for work, or anything that doesn't accept inbound connections.

### Setting a restart policy

Machines without services manage their own lifecycle through restart policies. Set the restart policy in the Machine config:

```json
{
  "config": {
    "restart": {
      "policy": "on-failure",
      "max_retries": 5
    }
  }
}
```

Available policies:

- `"no"` — don't restart on exit
- `"always"` — always restart on exit
- `"on-failure"` — restart only on non-zero exit, up to `max_retries`

## Operations not supported by the Machines API

The Machines REST API covers Machine lifecycle and most app-level operations. A few peripheral operations still require the GraphQL API, such as those relating to organizations and provisioning custom networks. The GraphQL API is an internal interface used by `flyctl` with no stability guarantees, so it can change without notice.

When possible, shell out to `flyctl` itself rather than hitting the GraphQL API directly. The CLI flags are a more stable interface than the underlying API.

If you can't use `flyctl` (for example, your system can't execute shell commands during setup), you can reverse-engineer the GraphQL calls:

```bash
LOG_LEVEL=debug fly <command>
```

This prints the full API communication, including GraphQL endpoints and payloads. You can copy these requests and make them from your own code. Keep in mind that they may break when `flyctl` updates.

## Related reading

- [Machines API reference](/docs/machines/api/machines-resource/) — full endpoint documentation
- [Working with the Machines API](/docs/machines/api/working-with-machines-api/) — authentication, rate limits, and connection details
- [Machine states and lifecycle](/docs/machines/machine-states/) — how Machines move between states
- [fly.toml configuration reference](/docs/reference/configuration/) — the flyctl-managed equivalent of API config
