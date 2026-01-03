---
title: Logs API options for programmatic access
layout: docs
nav: firecracker
author: kcmartin
date: 2025-10-01
---

## Overview

Fly.io apps run on Firecracker microVMs we call Machines. Each Machine captures `stdout`/`stderr`, ships those logs over [NATS](https://en.wikipedia.org/wiki/NATS_Messaging), and stores them for a period of time in a Quickwit-backed search index. Most users consume logs via `fly logs` or by setting up log shipping to an external sink.

But sometimes you want to grab logs directly, without a CLI or setting up an exporter, because you’re building a tool, automating something, or you just want to pipe logs into your own system.

---

## Options for fetching logs programmatically

You can get logs programmatically via:

- **Undocumented HTTP API**: What `fly logs` uses under the hood.
- **NATS proxy**: Subscribe to real-time logs at the message level.
- **Log shipper to external sink**: Ingest logs elsewhere, then query them via that system.

Each has tradeoffs. If you want durable search, export logs. If you want low-latency push, use NATS. If you want to `curl` something now, use the HTTP API.

### 1. HTTP API (same as `fly logs`)

The Fly CLI hits an internal API to stream logs. You can use it too:

```
GET /api/v1/apps/:app_name/logs
Authorization: <your-token>
```

You’ll get a stream of newline-delimited JSON log lines. You can pass query params like:

- `region=cdg` (filter by region)
- `instance=<id>` (filter by instance — sometimes flaky)
- `start_time=2023-08-01T00:00:00Z` (to backfill)

This endpoint isn’t officially documented, but it’s mostly stable: `flyctl` depends on it. That said, filters don’t always work as expected.

Use this for quick fetches or simple polling scripts. If you hit rate limits or auth issues, check that your token has `read` access to the app.

Importantly, this is the only option that gives you access to historical logs going back to the current retention window (about 15 days). The other options only start streaming from the moment they're connected.

### 2. Subscribe to logs via NATS (experimental)

Logs are streamed through NATS under subjects like:

```
logs.<app>.<region>.<instance>
```

You can subscribe directly using NATS clients, connecting via the proxy URL and authenticating with your org slug and personal access token.

Example NATS subject:

```
logs.my-app.lhr.*
```

This gives you structured JSON log messages in real time.

<div class="callout">
**Note:** The NATS proxy is a dusty corner of Fly’s platform. It works, but it’s unofficial, experimental, and may change as we evolve our logging infrastructure. If you’re building something serious, we recommend exporting logs instead.
</div>

**Things to know:**

- You’ll need to handle reconnections: if the network drops or the proxy restarts, your subscriber needs to reconnect and resume without losing messages.
- You’ll need to handle backpressure: if your app can’t process logs fast enough, messages might pile up and get dropped. Design your consumer to either keep up or fail gracefully.
- If you want to dedupe across subscribers, use NATS queue groups.
- NATS only streams logs from starting from the moment you connect. You won’t get any history unless you’ve been subscribed the whole time.

For more details on connecting to Fly’s NATS log stream (authentication, subject patterns, example clients), head over to the [Observability for User Apps](/docs/blueprints/observability-for-user-apps/?utm_source=chatgpt.com#streaming-fly-app-logs-to-your-end-users) guide.

### 3. Log Shipper to External Sink

If you want durable, queryable logs, export them. We maintain a small app called the [Fly Log Shipper](https://github.com/superfly/fly-log-shipper) that listens to NATS and forwards logs to sinks like Loki, Datadog, Elastic, Honeycomb, or even S3.

The log shipper is a prebuilt Fly app running Vector, with configuration you can customize via TOML. It subscribes to log subjects and streams data wherever you want.

Example config:

```
[sinks.loki]
type = "loki"
inputs = ["fly_logs"]
endpoint = "https://my-loki-instance.example"
encoding.codec = "json"
```

To control which logs get forwarded, set the `SUBJECT` environment variable when deploying:

```
SUBJECT="logs.my-app.*.*"
```

Like NATS, the log shipper only sees logs from the moment it connects onward. If you deploy it today, you won’t see logs from yesterday.

The log shipper is the most robust option if you want long-term retention, full-text search, alerting, or integration with your existing observability stack.

More details:

- [Fly Docs: Export logs](/docs/monitoring/exporting-logs/)
- [Fly Blog: Shipping Logs](https://fly.io/blog/shipping-logs/)
- [GitHub: superfly/fly-log-shipper](https://github.com/superfly/fly-log-shipper)

---

## Summary: So what should I use?

- Want to grep logs from a script? Try the HTTP API.
- Want real-time stream into your own system? NATS (with caveats).
- Want reliable search and dashboards? Export logs via shipper.
