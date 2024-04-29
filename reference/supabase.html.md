---
title: Supabase Postgres
layout: docs
sitemap: false
status: alpha
nav: firecracker
---

[Supabase](https://supabase.com) offers a preview of their managed Postgres service on Fly.io infrastructure. Provisioning Supabase on Fly.io ensures low-latency database access from applications hosted on Fly.io.

<aside class="callout">
This service is in **public alpha**. Do not run production workloads of any kind!

Alpha databases:
 * should only be used for testing and getting customer feedback
 * can lose data or go offline at any time
 * come with no support guarantees
 * won't be charged for
</aside>

## Create and manage a Supabase Postgres database

Creating and managing databases happens exclusively via the [Fly CLI](/docs/hands-on/install-flyctl/). Install it, then [signup for a Fly account](https://fly.io/docs/getting-started/log-in-to-fly/).

<aside class="callout">Running the following command in a Fly.io app context -- inside an app directory or specifying `-a yourapp` -- will automatically pick a region and set secrets on your app.</aside>

```cmd
flyctl ext supabase create
```
```output
? Select Organization: soupedup (soupedup)
? Choose a name, use the default, or leave blank to generate one:
? Choose the primary region (can't be changed later) Miami, Florida (US) (mia)
Your Supabase database (icy-wind-1879) in mia is ready.

Set one or more of the following secrets on your target app.
DATABASE_URL: postgres://postgres:password@db.kworhjwentroqhegh.supabase.co:5432/postgres?sslmode=disable
DATABASE_POOLER_URL: postgres://postgres.kworhjwentroqhegh@password@fly-0-mia.pooler.supabase.com:6543/postgres
```

`DATABASE_URL` offers a direct IPv6 connection to your database. Use this URL from your Fly.io applications.

`DATABASE_POOLER_URL` runs connections through a connection pooler. Currently, the connection pooler runs outside of Fly.io and may introduce connection latency. Use this URL to test connection pooling behavior, or to connect from locations that don't support IPv6, like many household ISPs.

## Pricing and Billing

<aside class="callout">
To test more than one database, or to test Supabase addons, you must upgrade your Supabase organization to the Supabase Pro Plan. Use `flyctl ext supabase dashboard --org yourorg` to sign in and upgrade.
</aside>

Supabase offers one free, resource-limited database per Fly.io user. After that, all databases are billed on pay-as-you-go basis under the [Supabase Pro plan](https://supabase.com/pricing#compare-plans). Check the official [Supabase Pricing](https://supabase.com/pricing) page for details.

While you won't be charged during alpha, database usage and Supabase plan fees will show up on your monthly Fly.io bill. You can track database usage details in the [Supabase web console](#the-supabase-web-console).


### The Supabase web console

To view more details about database usage, connection strings, and more, use:

```cmd
flyctl ext supabase dashboard <database_name>
```

Or, visit your organization-level overview for billing and organization settings:

```cmd
flyctl ext supabase dashboard --org <org_name>
```

### List your databases and view status
Get a list of all of your Supabase databases.

```cmd
flyctl ext supabase list
```
```output
NAME                  	ORG          	PRIMARY REGION
js-supabase-staging-db	fly-ephemeral	mad
late-surf-5384        	fly-ephemeral mad
```

Note the database name, then fetch its status.

```cmd
fly ext supabase status late-waterfall-1133
```
```output
Redis
  ID             = aaV829vaMVDGbi5
  Name           = late-waterfall-1133
  App            = myapp
```

### Delete a Supabase database

Deleting can't be undone. Be careful!

```cmd
fly ext supabase destroy wispy-resonance-270
```
```output
Destroying a Supabase database is not reversible.
? Destroy Supabase database wispy-resonance-270? Yes
Your Supabase database wispy-resonance-270 was destroyed
```