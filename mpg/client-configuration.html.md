---
title: "Connect Your Client"
layout: docs
nav: mpg
date: 2026-03-25
---

This guide covers how to connect your application to Fly Managed Postgres and configure your database client for reliable, performant connections.

## Quick start

After [creating your MPG cluster](/docs/mpg/create-and-connect/) and attaching your app, these are the essentials:

**1. Your connection string.** When you attach an app with `fly mpg attach`, Fly sets a `DATABASE_URL` secret on your app automatically. You can customize the variable name during attachment. Your app receives this as an environment variable at runtime. Both pooled and direct URLs are available from the **Connect** tab in your cluster's dashboard.

- **Pooled URL** (default): `postgresql://fly-user:YOUR_PASSWORD@pgbouncer.YOUR_CLUSTER.flympg.net/fly-db` — routes through PgBouncer. Use this for your application.
- **Direct URL**: `postgresql://fly-user:YOUR_PASSWORD@direct.YOUR_CLUSTER.flympg.net/fly-db` — bypasses PgBouncer. Use this for migrations, advisory locks, or `LISTEN/NOTIFY`.

SSL is enabled by default on all MPG connections. You do not need to set `sslmode` in your connection string.

**2. Set connection lifetime and idle timeout in your code.** These are settings you configure in your application's database client or connection pool library — not on the database or cluster side. Not all client libraries support these settings directly — see the [language-specific examples](#language-specific-configuration) below.

| Setting | Recommended value | Why |
|---------|-------------------|-----|
| Max connection lifetime | **600 seconds** (10 min) | Recycle connections before the proxy closes them |
| Idle connection timeout | **300 seconds** (5 min) | Releases unused connections before they're forcibly closed |

**3. Set up a direct URL for migrations.** Most frameworks run migrations on deploy. Migrations use advisory locks and other session-scoped features that require the direct URL, not the pooled one.

```bash
fly secrets set \
  DATABASE_URL="postgresql://...@pgbouncer.YOUR_CLUSTER.flympg.net/fly-db" \
  DIRECT_DATABASE_URL="postgresql://...@direct.YOUR_CLUSTER.flympg.net/fly-db"
```

```toml
# fly.toml
[deploy]
  release_command = "/bin/sh -lc 'DATABASE_URL=$DIRECT_DATABASE_URL bin/migrate'"
```

See the [Phoenix guide](/docs/mpg/guides-examples/phoenix-guide/) for Elixir-specific migration setup.

**4. Disable prepared statements in transaction mode.** If your PgBouncer pool mode is set to **Transaction** (required for Ecto; recommended for high-throughput apps), you must disable named prepared statements in your client. PgBouncer can't track prepared statements across transactions. See [Cluster Configuration](/docs/mpg/cluster-configuration/) for how to change your pool mode.

---

## Why client configuration matters

Your Fly.io apps, as well as your Fly.io Postgres databases, sit behind Fly.io's proxy. Public and private traffic route through this proxy. Sometimes our proxy restarts and the proxy does its best to drain connections before restarting. Postgres doesn't have a protocol level mechanism to tell clients to stop sending queries on a particular connection, so we have to rely on client-side configuration to handle graceful handoff.

The proxy's shutdown timeout is **10 minutes**. Any connection that remains open after that is terminated. If your application holds connections for longer than this — which is the default behavior of most connection pools — you might run into errors like `tcp recv (idle): closed` or `ECONNRESET` during proxy deployments.

The fix is straightforward: configure your connection pool to **proactively recycle connections** on a shorter interval than the proxy's timeout.

## PgBouncer mode and your client

All MPG clusters include PgBouncer for connection pooling. The pool mode you choose on the cluster side affects what your client can do. See [Cluster Configuration](/docs/mpg/cluster-configuration/) for how to change modes.

**Session mode** (default): A PgBouncer connection is held for the entire client session. Full PostgreSQL feature compatibility — prepared statements, advisory locks, `LISTEN/NOTIFY`, and multi-statement transactions all work normally. Lower connection reuse.

**Transaction mode**: PgBouncer assigns a connection per transaction and returns it to the pool afterward. Higher throughput and connection reuse, but:

- **Named prepared statements** don't work — you must use unnamed/extended query protocol
- **Advisory locks** are not session-scoped — use the direct URL for migrations
- **`LISTEN/NOTIFY`** doesn't work — use an alternative notifier (see the [Phoenix guide](/docs/mpg/guides-examples/phoenix-guide/) for Oban examples)
- **`SET` commands** affect only the current transaction

If your ORM or driver supports it, transaction mode with unnamed prepared statements is the better choice for most web applications.

## Language-specific configuration

<details data-render="markdown">
<summary>Node.js — pg (node-postgres)</summary>

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Pool sizing
  max: 10,

  // Connection lifecycle
  idleTimeoutMillis: 300_000,       // 5 min — close idle connections
  maxLifetimeSeconds: 600,          // 10 min — recycle before proxy timeout
  connectionTimeoutMillis: 5_000,   // 5s — fail fast on connection attempts
});
```

`maxLifetimeSeconds` was added in `pg-pool` 3.5.1 (included with `pg` 8.8+). If you're on an older version, upgrade — this setting is critical for reliable connections on Fly.

</details>

<details data-render="markdown">
<summary>Node.js — Prisma</summary>

Add the following query parameters to your connection string:

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `pgbouncer` | `true` | Disables prepared statements for PgBouncer compatibility |
| `connection_limit` | `10` | Pool size per Prisma client instance |
| `pool_timeout` | `30` | Seconds to wait for a connection |

Your `DATABASE_URL` should look like:

`postgresql://...@pgbouncer.YOUR_CLUSTER.flympg.net/fly-db?pgbouncer=true&connection_limit=10&pool_timeout=30`

In your Prisma schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Prisma manages its own connection pool internally. The `connection_limit` parameter controls the pool size per Prisma client instance.

</details>

<details data-render="markdown">
<summary>Python — SQLAlchemy</summary>

```python
import os
from sqlalchemy import create_engine

engine = create_engine(
    os.environ["DATABASE_URL"],

    # Pool sizing
    pool_size=10,
    max_overflow=5,

    # Connection lifecycle
    pool_recycle=600,       # 10 min — recycle connections before proxy timeout
    pool_timeout=30,        # 30s — wait for available connection
    pool_pre_ping=True,     # verify connections before use

    # Disable prepared statements for PgBouncer transaction mode
    # (uncomment if using transaction mode)
    # connect_args={"prepare_threshold": None},  # for psycopg3
    # connect_args={"options": "-c plan_cache_mode=force_custom_plan"},  # alternative
)
```

`pool_recycle` is the max connection lifetime — SQLAlchemy will close and replace connections older than this value.

`pool_pre_ping` issues a lightweight `SELECT 1` before each connection checkout. This adds a small round-trip but catches stale connections before your query fails.

</details>

<details data-render="markdown">
<summary>Python — psycopg3 connection pool</summary>

```python
import os
from psycopg_pool import ConnectionPool

pool = ConnectionPool(
    conninfo=os.environ["DATABASE_URL"],

    # Pool sizing
    min_size=2,
    max_size=10,

    # Connection lifecycle
    max_lifetime=600,       # 10 min — recycle before proxy timeout
    max_idle=300,           # 5 min — close idle connections
    reconnect_timeout=5,

    # Disable prepared statements for PgBouncer transaction mode
    # (uncomment if using transaction mode)
    # kwargs={"prepare_threshold": None},
)
```

</details>

<details data-render="markdown">
<summary>Go — database/sql with pgx</summary>

```go
import (
    "database/sql"
    "os"
    "time"

    _ "github.com/jackc/pgx/v5/stdlib"
)

// Open the connection pool.
db, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))
if err != nil {
    log.Fatal(err)
}

// Pool sizing
db.SetMaxOpenConns(10)
db.SetMaxIdleConns(5)

// Connection lifecycle
db.SetConnMaxLifetime(10 * time.Minute) // recycle before proxy timeout
db.SetConnMaxIdleTime(5 * time.Minute)  // close idle connections
```

Go's `database/sql` handles connection recycling natively. `SetConnMaxLifetime` is the key setting — it ensures no connection is reused beyond the specified duration.

To disable prepared statements for PgBouncer transaction mode, use the `default_query_exec_mode` connection parameter:

```go
connStr := os.Getenv("DATABASE_URL") + "?default_query_exec_mode=exec"
db, err := sql.Open("pgx", connStr)
```

</details>

<details data-render="markdown">
<summary>Ruby — ActiveRecord (Rails)</summary>

```yaml
# config/database.yml
production:
  url: ENV["DATABASE_URL"]
  pool: ENV.fetch("RAILS_MAX_THREADS", 5)
  idle_timeout: 300           # 5 min — close idle connections
  checkout_timeout: 5
  prepared_statements: false  # required for PgBouncer transaction mode
```

For connection max lifetime, Rails 8.1+ supports `max_age` natively:

```yaml
# config/database.yml (Rails 8.1+)
production:
  url: ENV["DATABASE_URL"]
  pool: ENV.fetch("RAILS_MAX_THREADS", 5)
  max_age: 600                # 10 min — recycle before proxy timeout
  idle_timeout: 300
  checkout_timeout: 5
  prepared_statements: false
```

On older Rails versions, there is no built-in max connection age. Connections will still be recycled by the idle timeout if your app has enough traffic, but long-lived busy connections won't be recycled until they encounter an error.

</details>

<details data-render="markdown">
<summary>Elixir/Phoenix — Ecto</summary>

```elixir
# config/runtime.exs
config :my_app, MyApp.Repo,
  url: System.fetch_env!("DATABASE_URL"),
  pool_size: 8,
  prepare: :unnamed   # required for PgBouncer transaction mode
```

For comprehensive Phoenix setup including migrations, Oban configuration, and Ecto-specific troubleshooting, see the [Phoenix with Managed Postgres](/docs/mpg/guides-examples/phoenix-guide/) guide.

<div class="note icon">
**Note on connection lifetime in Ecto:** Postgrex does not currently support a max connection lifetime setting. Connections are recycled only when they encounter errors or are explicitly disconnected. The idle timeout and PgBouncer's own `server_lifetime` setting (default 3600s) provide some protection, but for the most reliable behavior during proxy restarts, a `max_lifetime` option in Postgrex/DBConnection would be ideal. This is a known gap.
</div>

<!-- TODO: Update this section when postgrex adds max_lifetime support -->

</details>

## Connection limits

Each MPG plan has a fixed number of PgBouncer connection slots shared across all clients. If your total pool size (across all app processes) exceeds this limit, new connections will be queued or rejected.

| Plan | Max client connections | Max database connections | Reserve pool |
|------|----------------------|------------------------|-------------|
| Basic | 200 | 50 | 10 |
| Starter | 200 | 50 | 10 |
| Launch | 500 | 150 | 30 |
| Scale | 1000 | 300 | 50 |
| Performance | 1000 | 300 | 50 |

**Max client connections** is the total number of client connections PgBouncer will accept. **Max database connections** is the number of actual connections PgBouncer opens to PostgreSQL. The reserve pool handles bursts above the normal pool size.

### Common connection limit errors

**`FATAL: too many connections for role`** or **`remaining connection slots are reserved for roles with the SUPERUSER attribute`**: Your total pool size across all processes exceeds the PgBouncer connection limit. To fix:

- Reduce `pool_size` / `max` in each process
- Switch to **transaction** pool mode for better connection reuse
- Check for connection leaks (connections opened but never returned to the pool)

**Calculating your total pool usage:** If you have 3 web processes with `pool_size: 10` and 2 worker processes with `pool_size: 5`, your total is `(3 × 10) + (2 × 5) = 40` connections.

## Troubleshooting

### `tcp recv (idle): closed` or `tcp recv (idle): timeout`

**Cause:** The proxy or PgBouncer closed an idle connection. This happens during proxy deployments (the proxy drains connections on restart) or when PgBouncer's idle timeout is reached.

**Fix:** Set your client's idle timeout to **300 seconds** (5 min) and max connection lifetime to **600 seconds** (10 min). Most connection pools reconnect automatically when a connection is closed — these errors are transient. If you're seeing them frequently outside of proxy deployments, reduce your pool size so fewer connections sit idle.

### `ECONNRESET` or "connection reset by peer"

**Cause:** A long-lived connection was terminated during something like a proxy restart. Connections that remain open too long during a proxy drain may be forcibly closed.

**Fix:** Set max connection lifetime to **600 seconds** (10 min) or less so connections are recycled before the proxy needs to kill them. Enable retry logic with backoff for transient failures.

### Prepared statement errors

Errors like `prepared statement "..." does not exist`, `prepared statement "..." already exists`, or `protocol_violation` on login all point to the same root cause: your client is sending named prepared statements through PgBouncer in transaction mode. PgBouncer assigns a different backend connection per transaction, so prepared statements created on one connection aren't available on the next.

**Fix:** Disable named prepared statements in your client configuration:
- **Node.js (pg):** This is the default behavior — no change needed
- **Prisma:** Add `?pgbouncer=true` to your connection string
- **Python (psycopg3):** Set `prepare_threshold=None`
- **Go (pgx):** Use `default_query_exec_mode=exec`
- **Ruby (ActiveRecord):** Set `prepared_statements: false`
- **Elixir (Ecto):** Set `prepare: :unnamed`

### Connection hangs on startup

**Cause:** DNS resolution failure on Fly's internal IPv6 network. Your app can't resolve the `.flympg.net` address.

**Fix:** Ensure your app is configured for IPv6. For Elixir apps, see the [IPv6 settings guide](https://fly.io/docs/elixir/getting-started/#important-ipv6-settings). For other runtimes, verify that your DNS resolver supports AAAA records on the Fly private network.
