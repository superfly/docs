---
title: Supabase Postgres
layout: docs
sitemap: false
nav: firecracker
---

[Supabase](https://supabase.com) partnered with Fly.io to offer fully managed Postgres databases hosted on Fly.io infrastructure. Using Supabase Postgres ensures low latency database access in all Fly.io regions.

## Pricing and Billing

Supabase offers one free, resource-limited database per Fly.io organization. After that, all databases are billed on pay-as-you-go basis under the [Supabase Pro plan](https://supabase.com/pricing#compare-plans). Check the official [Supabase Pricing](https://supabase.com/pricing) page for details.

Your database usage charges and plan fees will show up on your monthly Fly.io bill. You can track database usage details in the [Supabase web console](#the-supabase-web-console).

## Create and manage a Supabase Postgres database

Creating and managing databases happens exclusively via the [Fly CLI](/docs/hands-on/install-flyctl/). Install it, then [signup for a Fly account](https://fly.io/docs/getting-started/log-in-to-fly/).

Once provisioned, the database primary region cannot be changed.

```cmd
flyctl ext supabase create
```
```output
? Select Organization: soupedup (soupedup)
? Choose a name, use the default, or leave blank to generate one:
? Choose the primary region (can't be changed later) Miami, Florida (US) (mia)
Your Supabase database (icy-wind-1879) in mia is ready. See details and next steps with:

Set one or more of the following secrets on your target app.
POSTGRES_URL: postgres://postgres:password@db.kworhjwenfroqhegh.supabase.co:5432/postgres?sslmode=disable
```

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