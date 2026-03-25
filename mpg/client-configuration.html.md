---
title: "Client-Side Connection Configuration"
layout: docs
nav: mpg
date: 2026-03-25
---

This guide covers how to configure your application's database client for reliable, performant connections to Fly Managed Postgres. It explains why certain settings matter and provides configuration examples for popular libraries across multiple languages.

For a quick summary of the essentials, see [Connect Your Client](/docs/mpg/connect-your-client/).

## Why client configuration matters

Your application connects to Managed Postgres through Fly's edge proxy and PgBouncer. The proxy handles TLS termination and routes traffic across Fly's internal network. Periodically — typically during proxy deployments — the proxy needs to restart.

For HTTP/2 and WebSocket connections, the proxy sends a `GOAWAY` frame that tells clients to gracefully finish in-flight requests and open new connections. The PostgreSQL wire protocol has no equivalent mechanism. When the proxy restarts, it waits for existing connections to drain, but it can't tell your Postgres client to stop sending queries on the current connection.

The proxy's shutdown timeout is **15 minutes**. Any connection that remains open after that is terminated. If your application holds connections for longer than this — which is the default behavior of most connection pools — you'll see errors like `tcp recv (idle): closed` or `ECONNRESET` during proxy deployments.

The fix is straightforward: configure your connection pool to **proactively recycle connections** on a shorter interval than the proxy's timeout.

## Recommended settings

| Setting | Recommended value | Why |
|---------|-------------------|-----|
| Max connection lifetime | **600s** (10 min) | Connections recycle before the proxy's 15-min shutdown timeout |
| Idle connection timeout | **300s** (5 min) | Releases unused connections before they're forcibly closed |
| Pool size | **5–10** (Basic/Starter), **10–20** (Launch+) | Match your plan's PgBouncer capacity |
| Prepared statements | **Disabled** in transaction mode | PgBouncer can't track per-connection prepared statement state |
| Connection retries | **Enabled** with backoff | Handle transient connection drops during proxy restarts |

## PgBouncer mode and your client

All MPG clusters include PgBouncer for connection pooling. The pool mode you choose on the cluster side affects what your client can do. See [Cluster Configuration Options](/docs/mpg/configuration/) for how to change modes.

**Session mode** (default): A PgBouncer connection is held for the entire client session. Full PostgreSQL feature compatibility — prepared statements, advisory locks, `LISTEN/NOTIFY`, and multi-statement transactions all work normally. Lower connection reuse.

**Transaction mode**: PgBouncer assigns a connection per transaction and returns it to the pool afterward. Higher throughput and connection reuse, but:

- **Named prepared statements** don't work — you must use unnamed/extended query protocol
- **Advisory locks** are not session-scoped — use the direct URL for migrations
- **`LISTEN/NOTIFY`** doesn't work — use an alternative notifier (see the [Phoenix guide](/docs/mpg/guides-examples/phoenix-guide/) for Oban examples)
- **`SET` commands** affect only the current transaction

If your ORM or driver supports it, transaction mode with unnamed prepared statements is the better choice for most web applications.

## Language-specific configuration

### Node.js — pg (node-postgres)

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Pool sizing
  max: 10,

  // Connection lifecycle
  idleTimeoutMillis: 300_000,      // 5 min — close idle connections
  maxLifetimeMillis: 600_000,      // 10 min — recycle before proxy timeout
  connectionTimeoutMillis: 5_000,  // 5s — fail fast on connection attempts
});
```

`maxLifetimeMillis` was added in `pg-pool` 3.6.0 (included with `pg` 8.11+). If you're on an older version, upgrade — this setting is critical for reliable connections on Fly.

### Node.js — Prisma

Add `pgbouncer=true` and connection pool parameters to your connection string:

```env
DATABASE_URL="postgresql://fly-user:<password>@pgbouncer.<cluster>.flympg.net/fly-db?pgbouncer=true&connection_limit=10&pool_timeout=30"
```

The `pgbouncer=true` parameter tells Prisma to disable prepared statements and adjust its connection handling for PgBouncer compatibility.

In your Prisma schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Prisma manages its own connection pool internally. The `connection_limit` parameter controls the pool size per Prisma client instance. If you run multiple processes, keep total connections within your plan's capacity.

### Python — SQLAlchemy

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
    # connect_args={"prepare_threshold": 0},  # for psycopg3
    # connect_args={"options": "-c plan_cache_mode=force_custom_plan"},  # alternative
)
```

`pool_recycle` is the max connection lifetime — SQLAlchemy will close and replace connections older than this value.

`pool_pre_ping` issues a lightweight `SELECT 1` before each connection checkout. This adds a small round-trip but catches stale connections before your query fails.

### Python — psycopg3 connection pool

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
    # kwargs={"prepare_threshold": 0},
)
```

### Go — database/sql with pgx

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

### Ruby — ActiveRecord (Rails)

```yaml
# config/database.yml
production:
  url: <%= ENV["DATABASE_URL"] %>
  pool: <%= ENV.fetch("RAILS_MAX_THREADS", 5) %>
  idle_timeout: 300           # 5 min — close idle connections
  checkout_timeout: 5
  prepared_statements: false  # required for PgBouncer transaction mode
```

For connection max lifetime, Rails 7.2+ supports `max_lifetime` natively:

```yaml
# config/database.yml (Rails 7.2+)
production:
  url: <%= ENV["DATABASE_URL"] %>
  pool: <%= ENV.fetch("RAILS_MAX_THREADS", 5) %>
  max_lifetime: 600           # 10 min — recycle before proxy timeout
  idle_timeout: 300
  checkout_timeout: 5
  prepared_statements: false
```

On older Rails versions, connections will still be recycled by the idle timeout if your app has enough traffic. For low-traffic apps on older Rails, consider the [`activerecord-connection_reaper`](https://github.com/mperham/activerecord-connection_reaper) gem or a periodic reconnection task.

### Elixir/Phoenix — Ecto

```elixir
# config/runtime.exs
config :my_app, MyApp.Repo,
  url: System.fetch_env!("DATABASE_URL"),
  pool_size: 8,
  queue_target: 5_000,
  queue_interval: 5_000,
  prepare: :unnamed   # required for PgBouncer transaction mode
```

For comprehensive Phoenix setup including migrations, Oban configuration, and Ecto-specific troubleshooting, see the [Phoenix with Managed Postgres](/docs/mpg/guides-examples/phoenix-guide/) guide.

<div class="note icon">
**Note on connection lifetime in Ecto:** Postgrex does not currently support a max connection lifetime setting. Connections are recycled only when they encounter errors or are explicitly disconnected. The idle timeout and PgBouncer's own `server_lifetime` setting (default 1800s) provide some protection, but for the most reliable behavior during proxy restarts, a `max_lifetime` option in Postgrex/DBConnection would be ideal. This is a known gap.
</div>

<!-- TODO: Update this section when postgrex adds max_lifetime support -->

## Connection limits

<!-- ============================================================
     TODO FOR MPG TEAM: Replace placeholder values below with
     actual PgBouncer connection limits per plan before publishing.
     ============================================================ -->

Each MPG plan has a fixed number of PgBouncer connection slots shared across all clients. If your total pool size (across all app processes) exceeds this limit, new connections will be queued or rejected.

| Plan | PgBouncer max client connections | Direct max connections |
|------|--------------------------------|----------------------|
| Basic | _TBD_ | _TBD_ |
| Starter | _TBD_ | _TBD_ |
| Launch | _TBD_ | _TBD_ |
| Scale | _TBD_ | _TBD_ |
| Performance | _TBD_ | _TBD_ |

### Common connection limit errors

**`FATAL: too many connections for role`** or **`remaining connection slots are reserved for roles with the SUPERUSER attribute`**: Your total pool size across all processes exceeds the PgBouncer connection limit. To fix:

- Reduce `pool_size` / `max` in each process
- Switch to **transaction** pool mode for better connection reuse
- Check for connection leaks (connections opened but never returned to the pool)

**Calculating your total pool usage:** If you have 3 web processes with `pool_size: 10` and 2 worker processes with `pool_size: 5`, your total is `(3 × 10) + (2 × 5) = 40` connections. This must be within your plan's PgBouncer limit.

## Troubleshooting

### `tcp recv (idle): closed` or `tcp recv (idle): timeout`

**Cause:** The proxy or PgBouncer closed an idle connection. This happens during proxy deployments (the proxy drains connections on restart) or when PgBouncer's idle timeout is reached.

**Fix:** Set your client's idle timeout to **300 seconds** (5 min) and max connection lifetime to **600 seconds** (10 min). Most connection pools reconnect automatically when a connection is closed — these errors are transient. If you're seeing them frequently outside of proxy deployments, reduce your pool size so fewer connections sit idle.

### `ECONNRESET` or "connection reset by peer"

**Cause:** A long-lived connection was terminated during a proxy restart. The proxy's shutdown timeout is 15 minutes — any connection older than that is forcibly closed.

**Fix:** Set max connection lifetime to **600 seconds** (10 min) so connections are recycled before the proxy needs to kill them. Enable retry logic with backoff for transient failures.

### `FATAL 08P01 protocol_violation` on login

**Cause:** Your client is sending named prepared statements through PgBouncer in transaction mode. PgBouncer can't route prepared statements to the correct backend connection in this mode.

**Fix:** Disable named prepared statements in your client configuration:
- **Node.js (pg):** This is the default behavior — no change needed
- **Prisma:** Add `?pgbouncer=true` to your connection string
- **Python (psycopg3):** Set `prepare_threshold=0`
- **Go (pgx):** Use `default_query_exec_mode=exec`
- **Ruby (ActiveRecord):** Set `prepared_statements: false`
- **Elixir (Ecto):** Set `prepare: :unnamed`

### `prepared statement "..." does not exist`

**Cause:** Same as above — named prepared statements being used with PgBouncer in transaction mode.

**Fix:** Same as the `protocol_violation` fix above.

### Connection hangs on startup

**Cause:** DNS resolution failure on Fly's internal IPv6 network. Your app can't resolve the `.flympg.net` address.

**Fix:** Ensure your app is configured for IPv6. For Elixir apps, see the [IPv6 settings guide](https://fly.io/docs/elixir/getting-started/#important-ipv6-settings). For other runtimes, verify that your DNS resolver supports AAAA records on the Fly private network.
