---
title: Connecting to Apps
objective: Access Postgres from your application to query data, perform migrations, and all the other stuff that needs to be done to make a database useful.
layout: framework_docs
order: 1
---

How you connect to Postgres depends on the tools you're using. Connection string URIs are a common way to describe a connection to a Postgres server.

Connection strings have the following format:

```
postgres://{username}:{password}@{hostname}:{port}/{database}?options
```

The output from `flyctl postgres create` contains all the values you need to make a connection string to your database.

## Connecting to Fly Postgres From Within Fly

As a Fly.io application, your Postgres app is accessible through Fly's [private networking](/docs/reference/private-networking/). This means applications within the same organization can look up the app at `appname.internal`. This name, when looked up, can return one or more IPv6 addresses.

## Connecting to Fly Postgres From Outside Fly

Fly Postgres databases can be used from applications outside of Fly or within Fly, but between different organizations.

### On an instance with `flyctl` installed

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

### With your own WireGuard tunnel

If you have an active [WireGuard tunnel](/docs/reference/private-networking/#private-network-vpn) to your organization on our private network, you can connect to your Postgres cluster the same way you would from a Fly app within the same organization. For example, the following command would start an interactive terminal session on the cluster leader with `psql`:

```
psql postgres://postgres:secret123@appname.internal:5432
```

## Attaching to a Fly App

Using the superuser credentials, you can create databases, users, and whatever else you need for your apps. But we also have the `flyctl postgres attach` shortcut:

```
flyctl postgres attach --app <app-name> <postgres-app-name>
```

When you attach an app to Postgres, a number of things happen:

* A database and user are created in the Postgres App. If the attached app is named "myapp", both the database and the user are named "myapp" too.
* The user is allocated a generated password.

When the Attached app starts it will find an environment variable `DATABASE_URL` set to a Postgres connection URI with the username, password, host, port and dbname filled in.

## Detaching a Fly App

Use `flyctl postgres detach` to remove Postgres from the app.

```
flyctl postgres detach --app <app-name> <postgres-app-name>
```

This will revoke access to the attachment's role, remove the role, and remove the `DATABASE_URL` secret. The database will not be removed.


## Connecting external services

Sometimes we need to be able to allow external services to connect to our Postgres instance.  While we don't open up any external ports by default, we can achieve this through some simple configuration changes.

### Allocating an IP address

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


### External port configuration

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

### Deploying configuration changes
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

or by attaching the Postgres database to your Fly app.


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

You'll use the `pg` npm module to connect to Postgres from a Node.js app.

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
