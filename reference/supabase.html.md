---
title: Supabase Postgres
layout: docs
sitemap: false
status: beta
nav: firecracker
---

[Supabase](https://supabase.com) now offers their excellent managed Postgres service on Fly.io infrastructure. Provisioning Supabase via `flyctl` ensures secure, low-latency database access from applications hosted on Fly.io.

<aside class="callout">
This service is in private beta. Do not run production workloads yet! [Sign up here](https://forms.supabase.com/fly-postgres) for beta access.
</aside>

## Pricing and Billing

<aside class="callout">
During the Supabase beta, we recommend you upgrade your organization to the Supabase Pro Plan to test without limitations. Your beta credits will cover plenty of usage. Use `flyctl ext supabase dashboard --org yourorg` to sign in and upgrade.
</aside>

Supabase offers one free, resource-limited database per Fly.io user. After that, all databases are billed on pay-as-you-go basis under the [Supabase Pro plan](https://supabase.com/pricing#compare-plans). Check the official [Supabase Pricing](https://supabase.com/pricing) page for details.


Your database usage charges and plan fees will show up on your monthly Fly.io bill. You can track database usage details in the [Supabase web console](#the-supabase-web-console).

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