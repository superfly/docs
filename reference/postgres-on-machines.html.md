---
title: Fly Postgres on Apps V2
layout: docs
sitemap: false
nav: firecracker
---


<div class="callout">Fly Postgres on Apps V2 (i.e. Fly Postgres running on Fly Machines), is a preview feature. For production Postgres clusters on Fly.io, refer to **[Fly Postgres](/docs/reference/postgres/)**</div>


[Postgres](https://www.postgresql.org/), or PostgreSQL, is a powerful open-source object relational database system.

## About Fly Postgres on Machines


Fly Postgres is a regular Fly.io app, with an automated creation process and some platform integration to simplify management. It relies on building blocks available to all Fly apps, like `flyctl`, volumes, private networking, health checks, logs, metrics, and more. The source code is available on [GitHub](https://github.com/fly-apps/postgres-ha) to view and fork.

### About **Free** Postgres on Fly.io

You can use Fly's [free resource allowance](https://fly.io/docs/about/pricing/#free-allowances) in one place, or split it up. The following Postgres configurations fit within the free volume usage limit:

* single node, 3gb volume (single database)
* 2 x 1gb volumes (database in two regions, or a primary and replica in the same region)
* 3 x 1gb volumes (database in three regions)

If you want to keep your whole project free, save some compute allowance for your other apps.

See also [How to convert your not-free Postgres to free Postgres](https://community.fly.io/t/how-to-convert-your-not-free-postgres-to-free-postgres/3888).

## Creating a Postgres **app**
To create a Postgres cluster, use the `flyctl postgres create --machines` command. The command will walk you through the creation with prompts for name, region, and VM resources.

```cmd
flyctl postgres create --machines
```

```output
? App Name: pg-test
Automatically selected personal organization: TestOrg
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
  Production - Highly available, 2x shared CPUs, 4GB RAM, 40GB disk
  Production - Highly available, 4x shared CPUs, 8GB RAM, 80GB disk
  Specify custom configuration
```

The "Production" options give you a two-node cluster in a leader-replica configuration. A single-node "Development" instance can readily be scaled and [expanded to more regions](https://fly.io/docs/getting-started/multi-region-databases/).

```
Creating postgres cluster pg-test in organization TestOrg
Creating app...
Setting secrets...
Provisioning 1 of 1 machines with image flyio/postgres:14.4
Waiting for machine to start...Machine e784079b449483 is created
  Username:    postgres
  Password:    51QstQZZ2HPcozU
  Hostname:    pg-test.internal
  Proxy port:  5432
  Postgres port:  5433
Save your credentials in a secure place -- you won't be able to see them again!

Connect to postgres
Any app within the TestOrg organization can connect to this Postgres using the following credentials:
For example: postgres://postgres:51QstQZZ2HPcozU@pg-test.internal:5432
```

After answering all the prompts, you'll see a message saying that the cluster is being created. Take heed of the reminder to save your password in a safe place!

Your new Postgres cluster is ready to use once the deployment is complete.

Before we get any further, note that the automated Postgres creation process doesn't generate a `fly.toml` file in the working directory. This means that when you use `flyctl` commands with Fly Postgres apps, you'll have to specify the app, like so:

```cmd
flyctl <command> -a <postgres-app-name>
```

## Connecting to Postgres

How you connect to Postgres depends on the tools you're using. Connection string URIs are a common way to describe a connection to a Postgres server.

Connection strings have the following format:

```
postgres://{username}:{password}@{hostname}:{port}/{database}?options
```

The output from `flyctl postgres create` contains all the values you need to make a connection string to your database.


### Connecting to Postgres From Within Fly

As a Fly.io application, your Postgres app is accessible through Fly's [private networking](/docs/reference/private-networking/). This means applications within the same organization can look up the app at `appname.internal`. This name, when looked up, can return one or more IPv6 addresses.

### Connecting to Postgres From Outside Fly
#### On an instance with `flyctl` installed

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

### Attaching to a Fly App

Using the superuser credentials, you can create databases, users, and whatever else you need for your apps. But we also have the `flyctl postgres attach` shortcut:

```
flyctl postgres attach --app <app-name> <postgres-app-name>
```

When you attach an app to Postgres, a number of things happen:

* A database and user are created in the Postgres App. If the attached app is named "myapp", both the database and the user are named "myapp" too.
* The user is allocated a generated password.

When the Attached app starts it will find an environment variable `DATABASE_URL` set to a Postgres connection URI with the username, password, host, port and dbname filled in.

### Detaching a Fly App

Use `flyctl postgres detach` to remove Postgres from the app.

```
flyctl postgres detach --app <app-name> <postgres-app-name>
```

This will revoke access to the attachment's role, remove the role, and remove the `DATABASE_URL` secret. The database will not be removed.


### Connecting external services

Sometimes we need to be able to allow external services to connect to our Postgres instance.  While we don't open up any external ports by default, we can achieve this through some simple configuration changes.

#### Allocating an IP address

If you haven't already, you will need to allocate an IP address to your application.  You can view your list of IP's by running the following command from your application directory:
```cmd
fly ips list
```

You can allocate an IPv4 address by running the following:
```cmd
fly ips allocate-v4
```
If your network supports IPv6:
```cmd
fly ips allocate-v6
```

If you're not sure which one to use, just provision one of each and you should be good to go.


#### External port configuration

Now that we have an IP address, let's configure our app to expose an external port and direct incoming requests to our Postgres instance.

If you haven't already pulled down your `fly.toml` configuration file, you can do so by running:
```cmd
fly config save --app <app-name>
```

Now, let's open up our `fly.toml` file and configure our port mappings by defining a new `Service`.

```toml
[[services]]
  internal_port = 5432 # Postgres instance
  protocol = "tcp"


# Open port 10000 for plaintext connections.
[[services.ports]]
  handlers = []
  port = 10000
```

For additional information on services and service ports:
[The services sections](https://fly.io/docs/reference/configuration/#the-services-sections)

#### Deploying configuration changes
Once your `Service` has been specified, it's time to deploy our new configuration.

**Before running the command below, be sure to verify the version of Postgres you are running.  As an example, if you are running Postgres 12.x you would specify `flyio/postgres:14` as your target image.**
```cmd
fly deploy . --app <app-name> --image flyio/postgres:<major-version>
```


After the deploy completes, you can verify your `Service` configuration by running the `info` command:

```cmd
fly info
```
```output
...
Services
PROTOCOL PORTS
TCP      10000 => 5432 []
...
```


### Connection Examples

#### Connecting with Ruby ([docs](https://github.com/ged/ruby-pg))

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

#### Connecting with Rails ([docs](https://guides.rubyonrails.org/configuring.html#configuring-a-database))

Rails apps automatically connect to the database specified in the `DATABASE_URL` environment variable.

You can set this variable manually with `flyctl secrets set`
```bash
flyctl secrets set DATABASE_URL=postgres://postgres:secret123@postgresapp.internal:5432/yourdb
```

or by attaching the Postgres database to your Fly app.


#### Connecting with Go ([docs](https://github.com/jackc/pgx/wiki/Getting-started-with-pgx-through-database-sql))

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

#### Connecting with Node.js ([docs](https://node-postgres.com))

You'll use the `pg` npm module to connect to Postgres from a Node.js app.

```javascript
const { Client } = require('pg')
const client = new Client({connectionString: process.env.DATABASE_URL})

await client.connect()
const res = await client.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
await client.end()
```

#### Connecting with Prisma – Node.js ([docs](https://www.prisma.io/))

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

## Users / Roles

A Postgres cluster is configured with three users when created:

- `postgres` - a role with superuser and login privileges that was created for you along with the cluster. Since the `postgres` role has superuser rights, it's recommended that you only use it for admin tasks and create new users with access restricted to the minimum necessary for applications
- `flypgadmin` - this role is used internally by Fly.io to configure and query the Postgres cluster
- `repluser` - this is the user replica servers use for replication from the leader

You can view a list of users using `flyctl`

```cmd
flyctl postgres users list pg-test
```

```output
Running flyadmin user-list
USERNAME   SUPERUSER DATABASES
flypgadmin true      postgres
postgres   true      postgres
repluser   false     postgres
```


## Upgrading Postgres

You can update a Postgres cluster that was provisioned with `flyctl postgres create --machines`, to the latest [release](https://github.com/fly-apps/postgres-ha/releases) using [`flyctl pg update`](/docs/flyctl/postgres-update/).

Check your current image with [`flyctl status`](/docs/flyctl/status/):

```cmd
flyctl status -a <postgres-app-name>
```

And upgrade with:

```cmd
flyctl image update -a <postgres-app-name>
```



## Hardware

### Adding additional resources

You can scale VM resources for an individual machine with the `flyctl machine update` command:

```
$ fly machine update e784079b449483 --memory 1024 --app pg-test
```  

## Monitoring

### Status

You can use `flyctl status` to see a list of VMs and their status. The output for each VM includes it's role within the cluster.

```
$ flyctl status --app test-pg
ID            	STATE  	ROLE   	REGION	HEALTH CHECKS     	IMAGE                        	CREATED             	UPDATED
e784079b449483	started	leader 	iad   	3 total, 3 passing	flyio/postgres:14.4 (v0.0.26)	2022-09-26T16:58:50Z	2022-09-26T16:59:04Z
1781957c525989	started	replica	iad   	3 total, 3 passing	flyio/postgres:14.4 (v0.0.26)	2022-09-26T17:05:25Z	2022-09-26T17:05:38Z

```

To view the status of an individual Machine:

```
$ flyctl machine status e784079b449483 --app test-pg
Machine ID: e784079b449483
Instance ID: 01GDXBSCZ0TSKA40K478CQ0P26
State: started

VM
  ID            = e784079b449483
  Instance ID   = 01GDXBSCZ0TSKA40K478CQ0P26
  State         = started
  Image         = flyio/postgres:14.4 (v0.0.26)
  Name          = nameless-star-9637
  Private IP    = fdaa:0:2e26:a7b:775b:4009:bf60:2
  Region        = iad
  Process Group =
  Memory        = 256
  CPUs          = 1
  Created       = 2022-09-26T16:58:50Z
  Updated       = 2022-09-26T16:59:04Z
  Command       =
  Volume        = vol_w1q85vgg998vzdxe

Event Logs
STATE  	EVENT 	SOURCE	TIMESTAMP                    	INFO
started	start 	flyd  	2022-09-26T11:59:04.889-05:00
created	launch	user  	2022-09-26T11:58:50.789-05:00
```

### Checks

To view a list of health checks for a Fly Postgres app, run:

```
flyctl checks list -a test-pg
Health Checks for shaun-pg-mach-test
  NAME | STATUS  | MACHINE        | LAST UPDATED | OUTPUT
-------*---------*----------------*--------------*-----------------------------------------------------------------------------
  pg   | passing | 1781957c525989 | 3m49s ago    | 200 OK Output: "[✓]
       |         |                |              |
       |         |                |              | transactions: readonly (569.43µs)\n[✓]
       |         |                |              |
       |         |                |              | replication: syncing from fdaa:0:2e26:a7b:775b:4009:bf60:2 (144.39µs)\n[✓]
       |         |                |              |
       |         |                |              | connections: 6 used, 3 reserved, 300 max (6.3ms)"[✓]
       |         |                |              |
       |         |                |              |
  vm   | passing | 1781957c525989 | 3m21s ago    | 200 OK Output: "[✓]
       |         |                |              |
       |         |                |              | checkDisk: 860.8 MB (87.1%) free space on /data/ (520.24µs)\n[✓]
       |         |                |              |
       |         |                |              | checkLoad: load averages: 0.00 0.00 0.00 (350.76µs)\n[✓]
       |         |                |              |
       |         |                |              | memory: system spent 0s of the last 60s waiting on memory (54.97µs)\n[✓]
       |         |                |              |
       |         |                |              | cpu: system spent 930ms of the last 60s waiting on cpu (23.89µs)\n[✓]
       |         |                |              |
       |         |                |              | io: system spent 414ms of the last 60s waiting on io (20.02µs)"[✓]
       |         |                |              |
       |         |                |              |
  role | passing | 1781957c525989 | 3m53s ago    | 200 OK Output: "replica"[✓]
       |         |                |              |
       |         |                |              |
  pg   | passing | e784079b449483 | 10m9s ago    | 200 OK Output: "[✓]
       |         |                |              |
       |         |                |              | transactions: read/write (157.2µs)\n[✓]
       |         |                |              |
       |         |                |              | connections: 9 used, 3 reserved, 300 max (3.7ms)"[✓]
       |         |                |              |
       |         |                |              |
  vm   | passing | e784079b449483 | 10m49s ago   | 200 OK Output: "[✓]
       |         |                |              |
       |         |                |              | checkDisk: 918.45 MB (93.0%) free space on /data/ (48.94µs)\n[✓]
       |         |                |              |
       |         |                |              | checkLoad: load averages: 0.00 0.00 0.00 (91.52µs)\n[✓]
       |         |                |              |
       |         |                |              | memory: system spent 0s of the last 60s waiting on memory (38.75µs)\n[✓]
       |         |                |              |
       |         |                |              | cpu: system spent 114ms of the last 60s waiting on cpu (16.94µs)\n[✓]
       |         |                |              |
       |         |                |              | io: system spent 210ms of the last 60s waiting on io (14.93µs)"[✓]
       |         |                |              |
       |         |                |              |
  role | passing | e784079b449483 | 10m19s ago   | 200 OK Output: "leader"[✓]
       |         |                |              |
       |         |                |              |

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
fly postgres create --machines --snapshot-id <snapshot-id>
```

## High Availability and Global Replication

Fly Postgres uses [stolon](https://github.com/sorintlab/stolon) for leader election and streaming replication between 2+ Postgres servers. It provides a number of things, including a “keeper” that controls the Postgres process, a "sentinel" that builds the cluster view, and a “proxy” that always routes connections to the current leader.

If the leader becomes unhealthy (e.g. network or hardware issues), the proxy drops all connections until a new leader is elected. Once it’s ready, new connections go to the new leader automatically. The previous leader's VM will be replaced by another VM which will rejoin the cluster as a replica.


### Adding replicas
The easiest way to add additional replicas at this time is through the `fly machine clone` command:

```
fly machine clone <existing-machine-id> --region ord --app <app-name>

```
This will clone the spec from the source machine and use it to create the new replica.  


### Connecting to read replicas

The generated connection string uses port `5432` to connect to PostgreSQL. This port always forwards you to a writable instance. Port `5433` is direct to the PostgreSQL member, and used to connect to read replicas directly.

You can use the proxy port (`5432`) to connect from every region, but it will be quite slow. Especially because we put our PostgreSQL cluster in Santiago. Connecting to "local" replicas is much quicker, but does take some app logic.

The basic logic to connect is:

1. Set a `PRIMARY_REGION` environment variable on your app, `scl` for our `chaos-postgres` cluster.
2. Check the `FLY_REGION` environment variable at connect time, use `DATABASE_URL` as is when `FLY_REGION=scl`
3. Modify the `DATABASE_URL` when running in other regions:
   1. Change the port to `5433`

This is what it looks like in Ruby:

```ruby
class Fly
  def self.database_url
    primary = ENV["PRIMARY_REGION"]
    current = ENV["FLY_REGION"]
    db_url = ENV["DATABASE_URL"]
    
    if primary.blank? || current.blank? || primary == current
      return db_url
    end
    
    u = URI.parse(db_url)
    u.port = 5433
    
    return u.to_s
  end
end
```

Running this in `scl` will use the built-in `DATABASE_URL` and connect to port `5432`:

```
postgres://<user>:<password>@top1.nearest.of.chaos-postgres.internal:5432/rails_on_fly?sslmode=disable
```

In the other regions, the app will connect to port `5433`:
```
postgres://<user>:<password>@top1.nearest.of.chaos-postgres.internal:5433/rails_on_fly?sslmode=disable
```


### Detect write requests

#### Catch read-only errors
PostgreSQL conveniently sends a "read only transaction" error when you attempt to write to a read replica. All you need to do to detect write requests is catch this error.

#### Replay the request

Once caught, just send a `fly-replay` header specifying the primary region. For `chaos-postgres`, send `fly-replay: region=scl`, and we'll take care of the rest.

If you're working in Rails, just add this to your `ApplicationController`:

```ruby
class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::StatementInvalid do |e|
    if e.cause.is_a?(PG::ReadOnlySqlTransaction)
      r = ENV["PRIMARY_REGION"]
      response.headers["fly-replay"] = "region=#{r}"
      Rails.logger.info "Replaying request in #{r}"
      render plain: "retry in region #{r}", status: 409
    else
      raise e
    end
  end
end
```

### Library support

We would like to build libraries to make this seamless for most application frameworks and runtimes. If you have a particular app you'd like to distribute with PostgreSQL, [post in our community forums](https://community.fly.io/t/multi-region-database-guide/1600) and we'll write some code for you.

### Consistency model

This is a fairly typical read replica model. Read replicas are usually eventually consistent, and can fall behind the leader. Running read replicas across the world _can_ exacerbate this effect and make read replicas stale more frequently.

#### Request with writes

Requests to the primary region are strongly consistent. When you use the replay header to target a particular region, the entire request runs against the leader database. Your application will behave like you expect.

#### Read only requests

Most apps accept a `POST` or `PUT`, do a bunch of writes, and then redirect the user to a `GET` request. In most cases, the database will replicate the changes before the user makes the second request. But not always!

Most read heavy applications aren't especially sensitive to stale data on subsequent requests. A lagging read replica might result in an out of date view for users, but this might be reasonable for your use case.

If your app is sensitive to this (meaning, you never, under any circumstances want to show users stale data), you should be careful using read replicas.

#### Managing eventual consistency

For apps that are sensitive to consistency issues, you can add a counter or timestamp to user sessions that indicates what "version" of the database a particular user is expecting. When the user makes a request and the session's data version differs from the replica, you can use the same `fly-replay` header to redirect their request to the primary region – and then you'll know it's not stale.

In theory, you _could_ run PostgreSQL with synchronous replication and block until replicas receive writes. This probably won't work well for far flung read replicas.

### This is wrong for some apps

We built this set of features for read heavy apps that are primary HTTP request based. That is, most requests only perform reads and only some requests include writes.

#### Write-heavy workloads

If you write to the database on every request, this will not work for you. You will need to make some architectural changes to run a write-heavy app in multiple regions.

Some apps write background info like metrics or audit logs on every request, but are otherwise read heavy. If you're running an application like this, you should consider using something like [nats.io](https://nats.io) to send information to your primary region asynchronously.

Truly write-heavy apps require latency aware data partitioning, either at the app level or in a database engine. There are lots of interesting new databases that have features for this, try them out!

#### Long lived connections

If your app makes heavy use of long lived connections with interpolated writes, like websockets, this will not work for you. This technique is specific to HTTP request/response based apps that bundle writes up into specific requests.
