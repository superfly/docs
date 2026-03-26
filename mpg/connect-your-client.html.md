---
title: Connect Your Client
layout: docs
nav: mpg
date: 2026-03-25
---

After [creating your MPG cluster](/docs/mpg/create-and-connect/) and attaching your app, configure your database client for reliable connections. These settings prevent dropped connections during routine proxy maintenance and keep your connection pool healthy.

## Use the pooled connection URL

Always connect your application through PgBouncer using the **pooled URL** (the default when you attach an app). The pooled URL looks like:

```
postgresql://fly-user:<password>@pgbouncer.<cluster>.flympg.net/fly-db
```

Use the **direct URL** (`direct.<cluster>.flympg.net`) only for migrations, advisory locks, or `LISTEN/NOTIFY` — operations that require session-level stickiness.

## Set connection lifetime and idle timeout

Fly's edge proxy mediates connections between your app and your database. During routine deployments, the proxy restarts and long-lived connections are severed. Set your client's **max connection lifetime** so connections are recycled before the proxy needs to kill them.

| Setting | Recommended value | Why |
|---------|-------------------|-----|
| Max connection lifetime | **600 seconds** (10 min) | Recycle connections before the proxy closes them |
| Idle connection timeout | **300 seconds** (5 min) | Releases unused connections before they're forcibly closed |

## Keep your pool size modest

Match your pool size to your plan's capacity. Oversized pools waste PgBouncer slots and can trigger connection limit errors.

| Plan tier | Suggested pool size per process |
|-----------|-------------------------------|
| Basic / Starter | 5–10 |
| Launch and above | 10–20 |

If you run multiple processes (e.g., web + background workers), the total across all processes should stay within these ranges.

## Disable prepared statements in transaction mode

If your PgBouncer pool mode is set to **Transaction** (required for Ecto; recommended for high-throughput apps), you must disable named prepared statements in your client. PgBouncer can't track prepared statements across transactions.

See [Cluster Configuration Options](/docs/mpg/configuration/) for how to change your pool mode.

## Next steps

For language-specific configuration examples (Node.js, Python, Go, Ruby, Elixir), detailed troubleshooting, and connection limit details, see the full [Client-Side Connection Configuration](/docs/mpg/client-configuration/) guide.
