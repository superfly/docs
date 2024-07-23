---
title: Supabase Postgres
layout: docs
status: alpha
nav: firecracker
---

[Supabase](https://supabase.com) offers managed Postgres databases on Fly.io infrastructure. Provisioning Supabase on Fly.io ensures low-latency database access from applications hosted on Fly.io.

<aside class="callout">
This service is in **public alpha**. Here's what you should know.

Supabase Databases run on single machines and are susceptible to hardware issues. Restoring an affected database may require contacting support.

During the alpha, you won't be charged for usage, but your usage will show up as a preview on your Fly.io bill.

Most Supabase features besides raw Postgres are not enabled yet, such as [auth](https://supabase.com/docs/guides/auth) or [storage](https://supabase.com/docs/guides/storage).

Supabase's connection pooler runs on AWS infrastructure, so using it may add connection latency depending on your region's [proximity to AWS servers](https://rtt.fly.dev/).
</aside>

## Create and manage a Supabase Postgres database

Creating and managing databases happens exclusively via the [Fly CLI](/docs/flyctl/install/). Install it, then [signup for a Fly account](/docs/getting-started/sign-up-sign-in/).

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
fly ext supabase status late-surf-5384
```
```output
Status
   Name           = late-surf-5384
   Primary Region = mia
   Status         = created
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