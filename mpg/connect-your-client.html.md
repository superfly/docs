---
title: Connect Your Client
layout: docs
nav: mpg
date: 2026-03-25
---

After [creating your MPG cluster](/docs/mpg/create-and-connect/) and attaching your app, configure your database client for reliable connections. These settings prevent dropped connections during routine proxy maintenance and keep your connection pool healthy.

## Your connection string

When you attach an app with `fly mpg attach`, Fly sets a `DATABASE_URL` secret on your app automatically. You can customize the variable name during attachment. Your app receives this as an environment variable at runtime.

MPG provides two connection URLs:

- **Pooled URL** (default): `postgresql://fly-user:<password>@pgbouncer.<cluster>.flympg.net/fly-db` — routes through PgBouncer. Use this for your application.
- **Direct URL**: `postgresql://fly-user:<password>@direct.<cluster>.flympg.net/fly-db` — bypasses PgBouncer. Use this for migrations, advisory locks, or `LISTEN/NOTIFY`.

Both URLs are available from the **Connect** tab in your cluster's dashboard.

SSL is enabled by default on all MPG connections. You do not need to set `sslmode` in your connection string.

## Set up a direct URL for migrations

Most frameworks run migrations on deploy. Migrations use advisory locks and other session-scoped features that require the direct URL, not the pooled one. Set both URLs as secrets:

```bash
fly secrets set \
  DATABASE_URL="postgresql://...@pgbouncer.<cluster>.flympg.net/fly-db" \
  DIRECT_DATABASE_URL="postgresql://...@direct.<cluster>.flympg.net/fly-db"
```

Then configure your deploy to use the direct URL for migrations. For example, in `fly.toml`:

```toml
[deploy]
  release_command = "/bin/sh -lc 'DATABASE_URL=$DIRECT_DATABASE_URL bin/migrate'"
```

See the [Phoenix guide](/docs/mpg/guides-examples/phoenix-guide/) for Elixir-specific migration setup.

## Set connection lifetime and idle timeout

Fly's edge proxy mediates connections between your app and your database. During routine deployments, the proxy restarts and long-lived connections are severed. Set your client's **max connection lifetime** so connections are recycled before the proxy needs to kill them.

| Setting | Recommended value | Why |
|---------|-------------------|-----|
| Max connection lifetime | **600 seconds** (10 min) | Recycle connections before the proxy closes them |
| Idle connection timeout | **300 seconds** (5 min) | Releases unused connections before they're forcibly closed |

## Disable prepared statements in transaction mode

If your PgBouncer pool mode is set to **Transaction** (required for Ecto; recommended for high-throughput apps), you must disable named prepared statements in your client. PgBouncer can't track prepared statements across transactions.

See [Cluster Configuration Options](/docs/mpg/configuration/) for how to change your pool mode.

## Next steps

For language-specific configuration examples (Node.js, Python, Go, Ruby, Elixir), detailed troubleshooting, and connection limit details, see the full [Client-Side Connection Configuration](/docs/mpg/client-configuration/) guide.
