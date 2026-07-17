---
title: Migrate from Heroku
layout: docs
nav: firecracker
toc: true
redirect_from: /docs/rails/getting-started/migrate-from-heroku/
---

<figure class="flex justify-center">
  <img src="/static/images/migrate.png"
       alt="Illustration by Annie Ruygt of a bird carrying an app to a balloon who is welcoming the app to join his group"
       class="w-full max-w-lg mx-auto">
</figure>

This guide will walk you through migrating your Heroku app to Fly.io. Just follow the steps in order.

**What this guide covers:**
- Web apps in any language (Node.js, Python, Ruby, Go, etc.)
- Postgres databases
- Redis
- Background workers
- Environment variables
- Custom domains

**Time required:** Most apps can be migrated in under 30 minutes.

Unlike Heroku's dyno-based tiers, Fly.io uses pay-as-you-go pricing - you only pay for the compute, storage, and bandwidth you actually use. There are no fixed plan tiers to choose from. See [fly.io/pricing](https://fly.io/pricing) for current rates.

## TL;DR - The Fast Path

For experienced developers, here's the entire migration in 7 commands:

```bash
# 1. Export secrets (excluding Heroku-managed vars)
heroku config -s -a YOUR_HEROKU_APP | grep -v '^DATABASE_URL\|^REDIS_URL\|^HEROKU_' | sed "s/='\(.*\)'$/=\"\1\"/" > secrets.txt
# ⚠️ Don't commit secrets.txt to git!

# 2. Create Fly app (generates Dockerfile automatically)
cd your-app-directory
fly launch --no-deploy

# 3. Create Managed Postgres and import data
fly mpg create --name your-db --region iad
# ⚠️ Replace CLUSTER_ID below with the cluster ID from the output above.
# If you missed it, run: fly mpg list
fly mpg proxy CLUSTER_ID --local-port 15432 &
pg_dump --no-owner --no-acl "$(heroku config:get DATABASE_URL -a YOUR_HEROKU_APP)" | \
  PGPASSWORD=YOUR_FLY_DB_PASSWORD psql -h localhost -p 15432 -U fly-user -d fly-db
fly mpg attach CLUSTER_ID -a your-fly-app

# 4. Import secrets
cat secrets.txt | fly secrets import

# 5. Deploy
fly deploy

# 6. Verify
curl https://your-fly-app.fly.dev
```

For a more detailed explanation, read on.

## Prerequisites

Install both CLIs:

```bash
# Install Fly CLI
curl -fsSL https://fly.io/install.sh | sh

# Sign up / log in to Fly
fly auth signup   # or: fly auth login

# Make sure you're logged into Heroku
heroku login
```

## Step 1: Export Your Heroku Configuration

First, let's capture everything about your Heroku app.

```bash
# Set your Heroku app name
export HEROKU_APP="your-app-name"

# Export environment variables (excluding Heroku-managed ones)
heroku config -s -a $HEROKU_APP | grep -v '^HEROKU_' | grep -v '^DATABASE_URL' | grep -v '^REDIS_URL' | sed "s/='\(.*\)'$/=\"\1\"/" > heroku-env.txt
# ⚠️ This file contains secrets - don't commit it to git!

# See what add-ons you have
heroku addons -a $HEROKU_APP

# Check your current process types
heroku ps -a $HEROKU_APP
```

Take note of:
- Your add-ons (Postgres, Redis, etc.)
- Your dyno types (web, worker, etc.)

## Step 2: Prepare Your App

Make sure you have your app's source code locally:

```bash
# If you don't have it locally, clone from Heroku
heroku git:clone -a $HEROKU_APP
cd $HEROKU_APP
```

### Check for a Dockerfile

Fly works best with a Dockerfile. If you don't have one, that's fine - `fly launch` will generate one for you based on your app type.

### Check your Procfile

Your Heroku `Procfile` maps directly to Fly processes. A typical Procfile:

```procfile
web: npm start
worker: npm run worker
release: npm run db:migrate
```

## Step 3: Launch on Fly

From your app directory:

```bash
fly launch
```

This will:
1. Detect your app type (Node, Python, Rails, etc.)
2. Generate a Dockerfile if needed
3. Create a `fly.toml` configuration file
4. Ask if you want to provision a Postgres database

**When prompted:**
- Choose a name for your app (or accept the generated one)
- Select your preferred region
- Say **Yes** to Postgres if you need a database (choose "Managed Postgres" for the fully-managed option)
- Say **No** to deploy now - we'll do that after setting up secrets

## Step 4: Set Up Your Database

If you have Heroku Postgres, create a Managed Postgres cluster on Fly:

```bash
fly mpg create --name your-app-db --region iad
```

Save the connection details it outputs! You'll see something like:
```
Connection string: postgresql://fly-user:PASSWORD@pgbouncer.CLUSTER_ID.flympg.net/fly-db
```

Note the cluster ID (the `CLUSTER_ID` part) - you'll need it for the next few commands. If you lose it, you can always find it with `fly mpg list`.

To import your data, use `fly mpg proxy` to create a local tunnel, then `pg_dump` and `psql`:

```bash
# Terminal 1: Start a proxy to your Fly database (replace CLUSTER_ID with your cluster ID)
fly mpg proxy CLUSTER_ID --local-port 15432

# Terminal 2: Dump from Heroku and restore to Fly
export HEROKU_DB=$(heroku config:get DATABASE_URL -a $HEROKU_APP)

# Dump the database (plain SQL format)
pg_dump --no-owner --no-acl "$HEROKU_DB" > heroku-dump.sql

# Restore to Fly (via the proxy)
PGPASSWORD=YOUR_PASSWORD psql -h localhost -p 15432 -U fly-user -d fly-db -f heroku-dump.sql
```

You'll see some errors about Heroku-specific extensions (pg_stat_statements, event triggers) - these are safe to ignore. Your actual data will import successfully.

Attach the database to your app:

```bash
# Replace CLUSTER_ID with the cluster ID from fly mpg create (or run fly mpg list)
fly mpg attach CLUSTER_ID -a your-app-name
```

This automatically sets `DATABASE_URL` as a secret on your app.

## Step 5: Set Up Redis (if needed)

If you use Heroku Redis or Redis Cloud:

```bash
fly redis create
```

Follow the prompts. This uses Upstash Redis which is fully managed.

After creation, attach it to your app:

```bash
# The create command outputs a REDIS_URL - set it as a secret
fly secrets set REDIS_URL="redis://default:xxxxx@fly-your-redis.upstash.io:6379" -a your-app-name
```

**Note:** Fly Redis doesn't support importing existing data. For most use cases (caching, sessions), this is fine - the cache will warm up naturally.

## Step 6: Import Environment Variables

Remember that `heroku-env.txt` file we created? Let's import it:

```bash
# Import all your Heroku environment variables
cat heroku-env.txt | fly secrets import -a your-app-name
```

Double-check that secrets were imported:

```bash
fly secrets list -a your-app-name
```

## Step 7: Configure Processes (Web + Workers)

If your app has multiple process types (web + worker), edit your `fly.toml`:

```toml
[processes]
  web = "npm start"
  worker = "npm run worker"

# The web process gets the HTTP service
[http_service]
  internal_port = 8080
  processes = ["web"]
```

For a release command (like database migrations), add:

```toml
[deploy]
  release_command = "npm run db:migrate"
```

## Step 8: Deploy

```bash
fly deploy
```

Watch the deployment. If something fails, check the logs:

```bash
fly logs
```

## Step 9: Verify Your App

```bash
# Open your app in a browser
fly apps open

# Check the status
fly status

# View live logs
fly logs
```

## Step 10: Migrate Your Domain

If you have a custom domain on Heroku:

```bash
# Add your domain to Fly
fly certs add yourdomain.com -a your-app-name

# Get the IP addresses to point your DNS to
fly ips list -a your-app-name
```

Update your DNS:
- For apex domains (example.com): Create an A record pointing to the IPv4 address
- For subdomains (www.example.com): Create a CNAME pointing to `your-app-name.fly.dev`

Once DNS propagates, Fly automatically provisions an SSL certificate.

## Quick Reference: Command Mapping

| Heroku | Fly |
|--------|-----|
| `heroku apps` | `fly apps list` |
| `heroku logs -t` | `fly logs` |
| `heroku ps` | `fly status` |
| `heroku config` | `fly secrets list` |
| `heroku config:set KEY=value` | `fly secrets set KEY=value` |
| `heroku run bash` | `fly ssh console` |
| `heroku run rails console` | `fly ssh console -C "rails console"` |
| `heroku pg:psql` | `fly mpg connect CLUSTER_ID` |
| `heroku restart` | `fly apps restart` |
| `heroku scale web=2` | `fly scale count web=2` |

## Common Add-on Replacements

| Heroku Add-on | Fly Equivalent |
|---------------|----------------|
| Heroku Postgres | `fly mpg create` (Managed Postgres) |
| Heroku Redis / Redis Cloud | `fly redis create` (Upstash) |
| Heroku Scheduler | Use cron in your app, or a separate "cron" process |
| Papertrail | `fly logs` built-in, or add a log drain |
| SendGrid | Keep using SendGrid (just use API key) |
| New Relic | `fly extensions sentry` or keep using New Relic |
| S3 / Bucketeer | `fly storage create` (Tigris) or keep using S3 |
| Elasticsearch | Deploy Elasticsearch as a Fly app, or use a hosted service |
| Memcached | Use Redis instead (`fly redis create`) |

## Multiple Environments (Staging/Production)

Fly doesn't have "pipelines" like Heroku. Instead, create separate apps:

```bash
# Production
fly launch --name myapp

# Staging
fly launch --name myapp-staging
```

For CI/CD, use GitHub Actions with the [Fly GitHub Action](/docs/launch/continuous-deployment-with-github-actions/).


## Shutting Down Heroku

Once everything is working on Fly:

1. Update your DNS to point to Fly
2. Wait for DNS propagation (check with `dig yourdomain.com`)
3. Monitor both apps for a day to ensure no traffic goes to Heroku
4. Scale down Heroku dynos: `heroku ps:scale web=0 worker=0 -a $HEROKU_APP`
5. Cancel Heroku add-ons
6. Delete the Heroku app: `heroku apps:destroy -a $HEROKU_APP`

## Getting Help

- [Fly Community](https://community.fly.io)
- [Fly Docs](https://fly.io/docs)
- [Fly Status](https://status.fly.io)

