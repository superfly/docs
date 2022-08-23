---
title: Postgres on Fly
layout: docs
sitemap: false
nav: firecracker
---

[Postgres](https://www.postgresql.org/), or PostgreSQL, is a powerful open-source object relational database system.

## About Postgres On Fly

Postgres on Fly is a regular Fly.io app, with an automated creation process and some extensions to simplify management. It relies on building blocks available to all Fly apps, like `flyctl`, volumes, private networking, health checks, logs, metrics, and more. The source code is available on [GitHub](https://github.com/fly-apps/postgres-ha) to view and fork.

### About **Free** Postgres on Fly

You can use Fly's [free resource allowance](https://fly.io/docs/about/pricing/#free-allowances) in one place, or split it up. The following Postgres configurations fit within the free volume usage limit:

* single node, 3gb volume (single database)
* 2 x 1gb volumes (database in two regions, or a primary and replica in the same region)
* 3 x 1gb volumes (database in three regions)

If you want to keep your whole project free, save some compute allowance for your other apps.

See also [How to convert your not-free Postgres to free Postgres](https://community.fly.io/t/how-to-convert-your-not-free-postgres-to-free-postgres/3888).

## Creating a Postgres **app**

To create a Postgres cluster, use the `flyctl postgres create` command. The command will walk you through the creation with prompts for name, region, and VM resources.

```cmd
flyctl postgres create
```

```output
? App Name: c-pg-test
Automatically selected personal organization: Chris Nicoll
? Select region:  [Use arrows to move, type to filter]
> ams (Amsterdam, Netherlands)
  cdg (Paris, France)
  dfw (Dallas, Texas (US))
  ewr (Secaucus, NJ (US))
  fra (Frankfurt, Germany)
  gru (São Paulo)
? Select region: mia (Miami, Florida (US))
For pricing information visit: https://fly.io/docs/about/pricing/#postgresql-clusters
```

During this process, you get to choose from several preset resource configurations for the app:

```
? Select configuration:  [Use arrows to move, type to filter]
> Development - Single node, 1x shared CPU, 256MB RAM, 1GB disk
  Development - Single node, 1x shared CPU, 512MB RAM, 10GB disk
  Production - Highly available, 1x shared CPU, 256MB RAM, 10GB disk
  Production - Highly available, 1x Dedicated CPU, 2GB RAM, 50GB disk
  Production - Highly available, 2x Dedicated CPU's, 4GB RAM, 100GB disk
  Specify custom configuration
```

The "Production" options give you a two-node cluster in a leader-replica configuration. A single-node "Development" instance can readily be scaled and [expanded to more regions](https://fly.io/docs/getting-started/multi-region-databases/).

```
Creating postgres cluster c-pg-test in organization personal
Postgres cluster c-pg-test created
  Username:    postgres
  Password:    8a93cbc09798f3805056333072bd2b35be7eb634b13a05c3
  Hostname:    c-pg-test.internal
  Proxy Port:  5432
  PG Port: 5433
Save your credentials in a secure place, you won't be able to see them again!

Monitoring Deployment

1 desired, 1 placed, 1 healthy, 0 unhealthy [health checks: 3 total, 3 passing]
--> v0 deployed successfully

Connect to postgres
Any app within the personal organization can connect to postgres using the above credentials and the hostname "c-pg-test.internal."
For example: postgres://postgres:8a93cbc09798f3805056333072bd2b35be7eb634b13a05c3@c-pg-test.internal:5432

See the postgres docs for more information on next steps, managing postgres, connecting from outside fly:  https://fly.io/docs/reference/postgres/
```

After answering all the prompts, you'll see a message saying that the cluster is being created, followed by a deployment monitor watching as the app is launched. Take heed of the reminder to save your password in a safe place!

Your new Postgres cluster is ready to use once the deployment is complete.

Before we get any further, note that the automated Postgres creation process doesn't generate a `fly.toml` file in the working directory. This means that when you use `flyctl` commands with Fly Postgres apps, you'll have to specify the app, like so:

```cmd
flyctl <command> -a <postgres-app-name>
```

## Connecting to Postgres

How you connect to Postgres depends on the tools you're using. Connection string URIs are a common way to describe a connection to a postgres server.

Connection strings have the following format:

```
postgres://{username}:{password}@{hostname}:{port}/{database}?options
```

The output from `flyctl postgres create` contains all the values you need to make a connection string to your database.

### Connecting to Postgres from within Fly

As a Fly.io application, your Postgres app is accessible through Fly's [private networking](/docs/reference/private-networking/). This means applications within the same organization can look up the app at `appname.internal`. This name, when looked up, can return one or more IPv6 addresses.

### Connecting to Postgres from outside Fly
#### On a machine with `flyctl` installed

To connect to your Postgres database from outside your Fly organization, you need a WireGuard connection. However, `flyctl` on your local machine can connect using [user-mode WireGuard](/blog/our-user-mode-wireguard-year/) magic, without you having to set up your own WireGuard tunnel.

For a `psql` shell, you can just use the [`flyctl postgres connect`](/docs/flyctl/postgres-connect/) command:

```cmd
flyctl postgres connect -a <postgres-app-name>
```

You can also forward the server port to your local system with [`flyctl proxy`](/docs/flyctl/proxy/):

```cmd
flyctl proxy 5432 -a <postgres-app-name>
```

Then connect to your Postgres server at localhost:5432. Using `psql` again, as a trivial example, it would look like this:

```cmd
psql postgres://postgres:<password>@localhost:5432
```

If you already have something else listening on port 5432, you can run this instead:

```cmd
flyctl proxy 15432:5432 -a <postgres-app-name>
```

Then connect to localhost:15432.

As with all your Fly.io apps, you can get a root console on your app's VM using [flyctl ssh](/docs/flyctl/ssh/).

#### With your own WireGuard tunnel

If you have an active [WireGuard tunnel](/docs/reference/private-networking/#private-network-vpn) to your organization on our private network, you can connect to your Postgres cluster the same way you would from a Fly app within the same organization. For example, the following command would start an interactive terminal session on the cluster leader with `psql`:

```
psql postgres://postgres:secret123@appname.internal:5432
```

## Attaching an App to a Postgres app

Using the superuser credentials, you can create databases, users, and whatever else you need for your apps. But we also have the `flyctl postgres attach` shortcut:

```
flyctl postgres attach --app <app-name> <postgres-app-name>
```

When you attach an app to Postgres, a number of things happen:

* A database and user are created in the Postgres App. If the attached app is named "myapp", both the database and the user are named "myapp" too.
* The user is allocated a generated password.

When the Attached app starts it will find an environment variable `DATABASE_URL` set to a Postgres connection URI with the username, password, host, port and dbname filled in.

### Detaching an App from Postgres

Use `flyctl postgres detach` to remove postgres from the app.

```
flyctl postgres detach --app <app-name> <postgres-app-name>
```

This will revoke access to the attachment's role, remove the role, and remove the `DATABASE_URL` secret. The database will not be removed.

## High Availability

Fly Postgres uses [stolon](https://github.com/sorintlab/stolon) for leader election and streaming replication between 2+ postgres servers. It provides a number of things, including a “keeper” that controls the postgres process, a "sentinel" that builds the cluster view, and a “proxy” that always routes connections to the current leader.

5433 is the port the keeper tells postgres to listen on. Connecting there goes straight to Postgres, though it might be the leader or the replica. Since clients need writes, the proxy is listening on the default 5432 port so clients are connected to the current leader.

If the leader becomes unhealthy (eg network or hardware issues), the proxy drops all connections until a new leader is elected. Once it’s ready, new connections go to the new leader automatically. The previoius leader's VM will be replaced by another VM which will rejoin the cluster as a replica.

**In general, your clients should connect to port 5432.**

## Users / Roles

A Postgres cluster is configured with three users when created:

- `postgres` - a role with superuser and login privileges that was created for you along with the cluster. Since the `postgres` role has superuser rights, it's recommended that you only use it for admin tasks and create new users with access restricted to the minimum necessary for applications
- `flypgadmin` - this role is used internally by fly to configure and query the postgres cluster
- `repluser` - this is the user replica servers use for replication from the leader

You can view a list of users using `flyctl`

```cmd
flyctl postgres users list c-pg-test
```

```output
Running flyadmin user-list
USERNAME   SUPERUSER DATABASES
flypgadmin true      postgres
postgres   true      postgres
repluser   false     postgres
```

## Databases

One Postgres cluster can host multiple databases

### Listing Databases

You can view a list of databases with `flyctl`:

```cmd
flyctl postgres db list c-pg-test
```

```output
Running flyadmin database-list
NAME     USERS
postgres flypgadmin,postgres,repluser
```

## Connection Examples

### Connecting with Ruby ([docs](https://github.com/ged/ruby-pg))

Ruby apps use the `pg` gem to connect to postgres.

```ruby
require 'pg'

# Output a table of current connections to the DB
conn = PG.connect("postgres://postgres:secret123@postgresapp.internal:5432/yourdb")
conn.exec( "SELECT * FROM pg_stat_activity" ) do |result|
  puts "     PID | User             | Query"
  result.each do |row|
    puts " %7d | %-16s | %s " %
      row.values_at('pid', 'usename', 'query')
  end
end
```

### Connecting with Rails ([docs](https://guides.rubyonrails.org/configuring.html#configuring-a-database))

Rails apps automatically connect to the database specified in the `DATABASE_URL` environment variable.

You can set this variable manually with `flyctl secrets set`
```bash
flyctl secrets set DATABASE_URL=postgres://postgres:secret123@postgresapp.internal:5432/yourdb
```

or by attaching the postgres database to your fly app.


### Connecting with Go ([docs](https://github.com/jackc/pgx/wiki/Getting-started-with-pgx-through-database-sql))

`pgx` is the recommended driver for connecting to postgres. It supports the standard `database/sql` interface as well as directly exposing low level / high performance APIs.

First, add `github.com/jackc/pgx/v4` as a module depepdency.
```bash
go get github.com/jackc/pgx/v4
```

The following program will connect to the database in `DATABASE_URL` and run a query.
```go
package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/jackc/pgx/v4/stdlib"
)

func main() {
	db, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	var greeting string
	err = db.QueryRow("select 'Hello, world!'").Scan(&greeting)
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	fmt.Println(greeting)
}
```

### Connecting with Node.js ([docs](https://node-postgres.com))

You'll use the `pg` npm module to connect to postgres from a node.js app.

```javascript
const { Client } = require('pg')
const client = new Client({connectionString: process.env.DATABASE_URL})

await client.connect()
const res = await client.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
await client.end()
```

### Connecting with Prisma – Node.js ([docs](https://www.prisma.io/))

Prisma is an open-source object-relational mapper (ORM) for Node.js and works with both JavaScript and TypeScript. It consists of 3 components:
- Prisma Client - a type-safe query builder 
- Prisma Migrate - a data modeling and migration tool
- Prisma Studio - a modern intuitive GUI for interacting with your database


<details>
<summary>Set up Prisma in your project</summary>

Install the Prisma CLI and Prisma Client dependencies in your project

```
npm i --save-dev prisma
npm i @prisma/client
```

Initialize Prisma in your project:

```
npx prisma init
```
This command does the following:
- Creates a folder called `prisma` at the root of your project
- Creates a `.env` file at the root of your project if it doesn't exist
- Creates a `schema.prisma` file inside the `prisma` folder. This is the file that you will use to model your data

Update the `DATABASE_URL` in the `.env` to your PostgreSQL database
```
DATABASE_URL="postgres://postgres:secret123@postgresapp.internal:5432/yourdb"
```

If you are working in a brownfield project, you can introspect your database to generate the models in your `schema.prisma` file:

```
npx prisma db pull
```

</details>

Assuming you have the following model in your `schema.prisma` file:

Add a model to your `schema.prisma` file:

```groovy
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider  = "prisma-client-js"
}

model Post {
  id       Int     @id @default(autoincrement())
  title    String
  content  String?
}
```

You can query your database using Prisma as follows: 
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const posts = await prisma.post.findMany()

  const newPost = await prisma.post.create({
    data: {
      title: 'PostgreSQL on Fly',
      content: 'https://fly.io/docs/reference/postgres'
    }
  })
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## Monitoring

### Status

You can use `flyctl status` to see a list of VMs and their status. The output for each VM includes it's role within the cluster.

```
$ flyctl status
App
  Name     = test-postgres
  Owner    = superfly
  Version  = 6
  Status   = running
  Hostname = test.fly.dev

Deployment Status
  ID          = 044e9269-fabb-27a6-9d53-b25cd2f2e4c2
  Version     = v6
  Status      = successful
  Description = Deployment completed successfully
  Instances   = 2 desired, 2 placed, 2 healthy, 0 unhealthy

Instances
ID       VERSION REGION DESIRED STATUS            HEALTH CHECKS      RESTARTS CREATED
6b97fa06 6       iad    run     running (replica) 3 total, 3 passing 0        2021-02-10T23:31:49Z
da8141e7 6       iad    run     running (leader)  3 total, 3 passing 0        2021-02-10T23:21:21Z

```

To view the status of an individual VM:

```
$ flyctl vm status da8141e7
Instance
  ID            = da8141e7
  Version       = 6
  Region        = iad
  Desired       = run
  Status        = running (leader)
  Health Checks = 3 total, 2 passing, 1 critical
  Restarts      = 0
  Created       = 2021-02-10T23:21:21Z

Recent Events
TIMESTAMP            TYPE       MESSAGE
2021-02-10T23:21:18Z Received   Task received by client
2021-02-10T23:21:48Z Task Setup Building Task Directory
2021-02-10T23:21:49Z Started    Task started by client

Checks
ID   SERVICE STATE    OUTPUT
vm   app     critical [✗] system spent 31.9 of the last 10 seconds waiting for cpu
                      [✓] 20.53 GB (83.9%) free space on /data/
                      [✓] load averages: 0.29 0.35 0.50
                      [✓] memory: 0.9s waiting over the last 60s
                      [✓] io: 0.0s waiting over the last 60s

pg   app     passing  [✓] replication: currently leader
                      [✓] connections: 37 used, 3 reserved, 100 max

role app     passing  leader


Recent Logs
  2021-02-19T22:53:35Z [info] [HEALTHCHECK] [vm: failing] [✗] system spent 6.3 of the last 10 seconds waiting for memory↩︎[✗] system spent 27.5 of the last 10 seconds waiting for cpu↩︎[✓] 20.53 GB (83.9%) free space on /data/↩︎[✓] load averages: 0.29 0.35 0.58↩︎[✓] io: 0.1s waiting over the last 60s↩︎
  2021-02-19T22:54:35Z [info] [HEALTHCHECK] [vm: passing] [✓] 20.66 GB (84.4%) free space on /data/↩︎[✓] load averages: 0.28 0.31 0.28↩︎[✓] memory: 0.7s waiting over the last 60s↩︎[✓] cpu: 8.6s waiting over the last 60s↩︎[✓] io: 0.1s waiting over the last 60s↩︎
```

### Checks

To view a list of health checks for a Fly Postgres app, run:

```
flyctl checks list -a pg-app
Health Checks for pg-app
NAME STATUS  ALLOCATION REGION TYPE   LAST UPDATED         OUTPUT
vm   passing 6b97fa06   iad    SCRIPT 1m12s ago            [✓] 20.68 GB (84.5%) free
                                                           space on /data/ [✓] load
                                                           averages: 0.00 0.00 0.00 [✓]
                                                           memory: 0.0s waiting over the
                                                           last 60s [✓] cpu: 0.4s waiting
                                                           over the last 60s [✓] io: 0.0s
                                                           waiting over the last 60s
pg   passing 6b97fa06   iad    SCRIPT 5m36s ago            [✓] leader check:
                                                           [fdaa:0:33:a7b:ab8:0:c24:2]:5433
                                                           connected [✓] replication lag:
                                                           246µs [✓] connections: 7 used, 3
                                                           reserved, 100 max
role passing 6b97fa06   iad    SCRIPT 2021-02-15T22:49:36Z replica
vm   passing da8141e7   iad    SCRIPT 14s ago              [✓] 20.66 GB (84.4%) free
                                                           space on /data/ [✓] load
                                                           averages: 0.31 0.37 0.32 [✓]
                                                           memory: 1.1s waiting over the
                                                           last 60s [✓] cpu: 9.4s waiting
                                                           over the last 60s [✓] io: 0.1s
                                                           waiting over the last 60s
pg   passing da8141e7   iad    SCRIPT 2m53s ago            [✓] replication: currently
                                                           leader [✓] connections: 31
                                                           used, 3 reserved, 100 max
role passing da8141e7   iad    SCRIPT 2021-02-15T22:49:38Z leader

```

### Logs

Fly Postgres apps run several processes inside each VM, including postgres, stolon keeper, stolon sentinel, stolon proxy, and postgres_export. Each of those processes redirect STDOUT and STDERR to logs which you can view with `flyctl logs`.

### Metrics

Fly Postgres apps export metrics to prometheus which can be seen in the Metrics UI or queried from grafana.

The available metrics are
```
pg_stat_activity_count
pg_stat_activity_max_tx_duration
pg_stat_archiver_archived_count
pg_stat_archiver_failed_count
pg_stat_bgwriter_buffers_alloc
pg_stat_bgwriter_buffers_backend_fsync
pg_stat_bgwriter_buffers_backend
pg_stat_bgwriter_buffers_checkpoint
pg_stat_bgwriter_buffers_clean
pg_stat_bgwriter_checkpoint_sync_time
pg_stat_bgwriter_checkpoint_write_time
pg_stat_bgwriter_checkpoints_req
pg_stat_bgwriter_checkpoints_timed
pg_stat_bgwriter_maxwritten_clean
pg_stat_bgwriter_stats_reset
pg_stat_database_blk_read_time
pg_stat_database_blk_write_time
pg_stat_database_blks_hit
pg_stat_database_blks_read
pg_stat_database_conflicts_confl_bufferpin
pg_stat_database_conflicts_confl_deadlock
pg_stat_database_conflicts_confl_lock
pg_stat_database_conflicts_confl_snapshot
pg_stat_database_conflicts_confl_tablespace
pg_stat_database_conflicts
pg_stat_database_deadlocks
pg_stat_database_numbackends
pg_stat_database_stats_reset
pg_stat_database_tup_deleted
pg_stat_database_tup_fetched
pg_stat_database_tup_inserted
pg_stat_database_tup_returned
pg_stat_database_tup_updated
pg_stat_database_xact_commit
pg_stat_database_xact_rollback
pg_stat_replication_pg_current_wal_lsn_bytes
pg_stat_replication_pg_wal_lsn_diff
pg_stat_replication_reply_time
pg_replication_lag
pg_database_size_bytes
```

## Hardware

## Scaling the Postgres Cluster

### Scaling Vertically - adding More VM Resources

You can change VM resources with the `flyctl scale vm` command:

```
$ flyctl scale vm dedicated-cpu-2x
Scaled VM Type to dedicated-cpu-1x
      CPU Cores: 1
         Memory: 2 GB

```

See [Scaling VM Resources](https://fly.io/docs/reference/scaling/#scaling-virtual-machines) for more.

### Scaling Horizontally - adding more replicas

```
flyctl volumes create pg_data --region syd --size 10
flyctl scale count 3
```

Replicas can be added in any region, but an instance outside the leader's region will be read-only. See [Multi-region PostgreSQL](/docs/getting-started/multi-region-databases/) for more.


## Upgrading the Postgres app

You can update a Postgres cluster, installed with `flyctl postgres create`, to the latest [release](https://github.com/fly-apps/postgres-ha/releases) using [`flyctl image update`](/docs/flyctl/image-update/).

Check your current image with [`flyctl image show`](/docs/flyctl/image-show/):

```cmd
flyctl image show -a <postgres-app-name>
```

And upgrade with:

```cmd
flyctl image update -a <postgres-app-name>
```

## Snapshots and restores

Fly.io performs daily storage-based snapshots of each of your provisioned volumes. These snapshots can
be used to restore your dataset into a new Postgres application.

### Listing snapshots

Snapshots are volume specific, so you will need to first identify a volume to target. You can list your volumes by running the `volumes list` command with your Postgres app name.

```cmd
fly volumes list -a <postgres-app-name>
```
```output
ID                   NAME    SIZE REGION ATTACHED VM CREATED AT
vol_x915grn008vn70qy pg_data 10GB atl    b780ce3d    2 weeks ago
vol_ke628r677pvwmnpy pg_data 10GB atl    359d0e24    2 weeks ago
```

Once you have identified which volume to target, you can go ahead and list your snapshots by running the following command:
```cmd
fly volumes snapshots list <volume-id>
```
```output
ID                  SIZE   CREATED AT
vs_2AjJ4lGqQwDbRfxm 29 MiB 2 hours ago
vs_BAARBQxZKl6JKU04 27 MiB 1 day ago
vs_OPQXXna6kA2Qnhz8 26 MiB 2 days ago
```
### Restoring from a snapshot

To restore a Postgres application from a snapshot, simply specify the `--snapshot-id` argument when running the `create` command as shown below:
```cmd
fly postgres create --snapshot-id <snapshot-id>
```
