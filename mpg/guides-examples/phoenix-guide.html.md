---
title: "Phoenix with Managed Postgres"
layout: docs
nav: mpg
date: 2025-09-16
author: Kaelyn
---

This guide explains the key **Managed Postgres (MPG)-specific adjustments** you need when connecting a Phoenix app. We'll focus on:

1. Connection Pooling Settings
2. Running Migrations
3. Using Oban with MPG
4. Troubleshooting and Common Issues

We'll skip general Phoenix/Ecto configuration, assuming you already have that in place.

## Connection Pooling with PgBouncer + Ecto

Fly.io MPG uses [PgBouncer](https://www.pgbouncer.org/) for connection pooling. By default, MPG clusters run in **Session** mode but Ecto requires **Transaction** mode due to how it handles connection pooling.

To configure PgBouncer:

1. Open your MPG cluster in the dashboard.
2. Go to **Connect → Pooler settings**.
3. Set **Pool mode** to **Transaction**.

You'll also need to update your repo config:

```elixir
config :my_app, MyApp.Repo,
  url: System.fetch_env!("DATABASE_URL"),
  pool_size: 8,
  timeout: 15_000,
  prepare: :unnamed
```

`prepare: :unnamed` is required because named prepared statements don't work with PgBouncer in transaction mode.

## Running Migrations

While you'll need to use Transaction mode with Ecto for most cases, Migrations are a special case. Migrations rely on advisory locks and session stickiness, which PgBouncer's transaction mode doesn't support. For running migrations you'll need to configure your app to use the **direct database URL** instead.

Update your secrets to add a `DIRECT_DATABASE_URL`

```bash
fly secrets set \
  DATABASE_URL="postgresql://...@pgbouncer.<cluster>.flympg.net/fly-db" \
  DIRECT_DATABASE_URL="postgresql://...@direct.<cluster>.flympg.net/fly-db"
```

In your fly.toml, update your release command to use the direct connection for running your migration:

```toml
[deploy]
  release_command = "/bin/sh -lc 'DATABASE_URL=$DIRECT_DATABASE_URL bin/migrate'"
```

Or run a migration manually:

```bash
fly ssh console -C '/bin/sh -lc "DATABASE_URL=\"$DIRECT_DATABASE_URL\" bin/migrate"'
```

## Using Oban with MPG

If you're using the Oban library for handling Job queues, you'll need to make a few adjustments as PgBouncer in transaction mode doesn't support `LISTEN/NOTIFY`, which Oban uses for job notifications. You have a few options:

### 1. Use a non-Postgres notifier

```elixir
# Distributed Erlang notifier
config :my_app, Oban,
  repo: MyApp.ObanRepo,
  notifier: Oban.Notifiers.PG,
  queues: [default: 10]
```

Or with Phoenix PubSub:

```elixir
config :my_app, Oban,
  repo: MyApp.ObanRepo,
  notifier: {Oban.Notifiers.Phoenix, pubsub: MyApp.PubSub},
  queues: [default: 10]
```

### 2. Run Oban on a direct connection

If you must use Postgres `LISTEN/NOTIFY`, you can set up Oban to use a direct database connection instead of using PG Bouncer

```elixir
config :my_app, Oban,
  repo: MyApp.DirectRepo,
  notifier: Oban.Notifiers.Postgres,
  queues: [default: 10]
```

This uses direct DB connections. Each connection is an Ecto pool entry that bypasses PgBouncer. Because direct connections are limited, keep the pool very small.

### 3. Legacy fallback (Oban < 2.14)

Older versions required the Repeater plugin. Since Oban 2.14 (2023), polling fallback is built-in and Repeater is deprecated.

## Troubleshooting and common errors

### Troubleshooting checklist

- Set PgBouncer pool mode to Transaction.
- Set `prepare: :unnamed` on every Repo.
- Use the pooled URL for app traffic and the direct URL for migrations and other session-scoped operations (advisory locks, etc.).
- Keep Ecto pools modest on the Basic plan (API repo 8, Oban repo 6). Reduce if most connections sit idle.
- Check MPG metrics around error timestamps for restarts or memory pressure.

### Common errors and fixes

- `tcp recv (idle): closed` or `tcp recv (idle): timeout` — These are idle connection reclaimed by the pooler, and don't represent an issue as Ecto reconnects automatically. To remove them, lower your pool size or ignore.
- `FATAL 08P01 protocol_violation` on login — Set `prepare: :unnamed` and ensure PgBouncer is in Transaction mode.
- Oban jobs not running — Use a non-Postgres notifier (PG or Phoenix) behind PgBouncer, or run Oban on a direct Repo. On Oban ≥ 2.14, do not add Repeater (polling fallback is automatic when PubSub isn't available).
- Migrations hanging or failing — Run migrations with the direct database URL (via `release_command` or a one-off SSH command), not through PgBouncer.
