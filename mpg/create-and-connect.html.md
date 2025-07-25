---
title: Create and Connect to a Managed Postgres Cluster
layout: docs
nav: firecracker
date: 2025-07-11
---


<figure class="flex justify-center">
  <img src="/static/images/Managed_Postgres.png" alt="Illustration by Annie Ruygt of a balloon doing a lot of tasks" class="w-full max-w-lg mx-auto">
</figure>


## Creating a Managed Postgres Cluster from the Dashboard

 To create a new Managed Postgres (MPG) cluster, visit your Fly.io dashboard, select the "Managed Postgres" tab on the left, and click the "Create new cluster" button.

You'll be prompted to set your clusters:

- Cluster name (must be unique within your organization)
- Region (see [available MPG regions](/docs/mpg/overview/#regions))
- A plan with predefined hardware resources:
  - Basic: 2 shared vCPUs, 1GB RAM
  - Launch: 2 Performance vCPUs, 8GB RAM
  - Scale: 4 Performance vCPUs, 32GB RAM
- Storage size (up to 500GB)
- Optional Third Party Extensions to install (Currently only PGVector is supported)

<div>
    <img src="/static/images/create-mpg.webp" alt="A screenshot of the Managed Postgres creation page.">
</div>

After configuring your cluster, select "Create Cluster" and wait a few moments for it to initialize. Once that's complete, you can now connect to your cluster

## Creating a Managed Postgres Cluster from Flyctl
You can also create an MPG cluster using the flyctl command line tool. To begin, run:

```cmd
fly mpg create
```
 Follow the prompts to configure your cluster name, plan, and region. By default your cluster will be created with a 10GB volume, but you can specify larger using the `--volume-size` flag:

```cmd 
fly mpg create [flags]
```
```out
 -n, --name string       The name of your Postgres cluster
 -o, --org string        The target Fly.io organization
      --pgvector          Enable PGVector for the Postgres cluster
      --plan string       The plan to use for the Postgres cluster (basic, launch, scale)
 -r, --region string     The target region
      --volume-size int   The volume size in GB (default 10)
```

After all options are set the cluster will begin initalizing. Once that's complete, you can now connect to your cluster.

## Attach an application to your Managed Postgres Database 

To connect your application running on Fly.io to your Managed Postgres instance, you'll need to add the DB connection details as a secret on your app. This can be done from the Dashboard or via flyctl.

### Attaching an app from your MPG dashboard

From the "Connect" tab of your MPG Cluster page you can attach a specific app in your organization to your database. 

1. Select the app to attach in the dropdown
2. If needed, customize the variable name to use for the database connection URL. The default is `DATABASE_URL`.  If your chosen app already has a secret named `DATABASE_URL`, you will need to choose a new variable name before you can deploy.
3.  Select "Set secret and deploy". This will trigger a deploy of your chosen app to add the new secret. 
4. Your app can now use the `DATABASE_URL` environment variable to connect to your database

### Attaching an app using flyctl

To attach an application to your database using flyctl run:
```cmd
fly mpg attach <clusterID> -a <app-to-attach>
```
This will also trigger a restart of the selected app in order to add the secret. You can find the cluster ID in your MPG dashboard or by using the `fly mpg list` command. 

Both of the attachment options will use the pooled connection URL, which uses PGBouncer to help manage database connections efficiently. This is recommended for most apps. 

### Manually connect an application using a connection string

After your database is created, the "Connection" tab will display connection strings for both the pooled connection URL, and the direct database connection address. You can use these to manually connect an app to the database by setting it as a secret in your Fly.io application:

```cmd
fly secrets set DATABASE_URL="postgres://username:password@host:port/database"
```

## Configuring Connection Pool Mode

Your Managed Postgres cluster uses PGBouncer for connection pooling, which helps manage database connections efficiently. You can configure how PGBouncer assigns connections to clients by changing the pool mode.

### Pool Mode Options

There are two pool modes available:

- **Session**: Connections are assigned to clients for the entire session. This is the default mode and provides the most compatibility with PostgreSQL features, including transactions, prepared statements, and advisory locks.
- **Transaction**: Connections are assigned per transaction. This mode allows for higher connection reuse and better performance under high load, but has some limitations with certain PostgreSQL features.

### Changing Pool Mode from the Dashboard

To change the pool mode for your cluster:

1. Navigate to your MPG cluster's "Connect" tab in the dashboard
2. Click "View Pooler Settings" to expand the configuration options
3. Select your desired pool mode.
4. Click "Update Pool Mode"
5. Confirm the change in the modal dialog

**Note**: Changing the pool mode will restart the connection pooler nodes, which may cause brief connection interruptions. Your database itself will remain running.

### When to Use Each Mode

**Use Session mode when**:
- Your application uses prepared statements
- You need advisory locks or other session-specific features
- You're unsure which mode to choose (Session is the safer default)
- Your application has long-running transactions

**Use Transaction mode when**:
- You have a high-throughput application with many short transactions
- You want to maximize connection reuse
- Your application primarily uses simple queries without prepared statements
- You need to support more concurrent connections with the same hardware
- If you're using Elixir's Ecto library, you must use Transaction pool mode when connecting through the pooler, as Ecto's connection pooling behavior is incompatible with PGBouncer's Session mode.

## Connecting from a local machine using flyctl

Because your MPG Cluster runs within your Fly.io private network, it's not accessible over the public internet. You can use flyctl to securely connect to your database from your local machine for development, manual DB work, or to connect to a local tool. All connections using flyctl are securely routed through your organizations [private wireguard network](/docs/networking/private-networking/)

### Connecting with psql

To connect directly to your Managed Postgres database using psql:

```cmd
fly mpg connect [flags]
```

This command will create a direct connection to your database and open a psql session. You'll need a compatible psql version installed locally.

### Setting up a Proxy Connection

To create a proxy connection to your Managed Postgres database:

```cmd
fly mpg proxy [flags]
```

This will open a connection on one of your local ports that forwards to your database.

```out
$ fly mpg proxy    
? Select Organization: My Organization (personal)
? Select a Postgres cluster my-test-cluster (iad)
Proxying localhost:16380 to remote [fdaa:1:2345:0:0::11]:5432
```


This command is useful when you want to connect to your database from your local machine using tools other than psql, such as database management tools or your application in development. 

To use the local proxy connection you can modify the direct connection string from your dashboard, replacing the "flympg.net" domain with "localhost": 

```out
Connection String: postgres://fly-user:<password>@localhost:16380/fly-db
```

## Alternative: Connect via WireGuard

As an alternative to using flyctl proxy commands, you can connect to your MPG cluster directly through your organization's private network using WireGuard. 

First, [set up a WireGuard connection to your private network](/docs/blueprints/connect-private-network-wireguard/). Once connected, you can use the direct connection string from your MPG dashboard:

```cmd
psql "postgresql://fly-user:<PASSWORD>@direct.<CLUSTER_HASH_ID>.flympg.net/fly-db"
```

This connection method is particularly useful for database management tools that need persistent connections or development environments where you want direct database access.
