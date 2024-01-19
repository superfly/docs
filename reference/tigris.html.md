---
title: Tigris Global Object Storage
layout: docs
sitemap: false
status: beta
nav: firecracker
---

[Tigris](https://tigrisdata.com) is a globally caching, S3-compatible object storage service built on Fly.io infrastructure. Provisioning buckets via `flyctl` gets you low-latency object storage from anywhere in the world.

<aside class="callout">
This service is in private beta. Do not run production workloads yet! [Sign up here](https://hello.tigrisdata.com/forms/early-access/) for beta access.
</aside>

## Pricing and Billing

<aside class="callout">
During the Tigris beta, you may start to see usage costs accrue in your Fly.io invoice. Your beta credits will cover usage.
</aside>

Tigris buckets are billed by usage with no up-front costs. Check the official [Tigris Pricing](https://www.tigrisdata.com/docs/pricing/) page for details. This pricing can change as data transfer costs are worked out between Fly.io and Tigris.

## Create and manage a Tigris storage bucket

Creating and managing storage buckets happens exclusively via the [Fly CLI](/docs/hands-on/install-flyctl/). Install it, then [signup for a Fly account](https://fly.io/docs/getting-started/log-in-to-fly/).

<aside class="callout">Running the following command in a Fly.io app context -- inside an app directory or specifying `-a yourapp` -- will automatically set secrets on your app.</aside>

```cmd
fly storage create
```
```output
? Select Organization: fly-ephemeral (fly-ephemeral)
? Choose a name, use the default, or leave blank to generate one:
Your  project (summer-grass-2004) is ready.

Set one or more of the following secrets on your target app.
BUCKET_NAME: summer-grass-2004
AWS_ENDPOINT_URL_S3: https://fly.storage.tigris.dev
AWS_ACCESS_KEY_ID: tid_xxxxxx
AWS_SECRET_ACCESS_KEY: tsec_xxxxxx
```

### Public buckets

By default, buckets are private. If you want objects to be available for download by anyone, create a *public bucket*:

```
fly storage create --public
```

### The Tigris web console

To view more details about your buckets, sign in to the Tigris web console.

```cmd
flyctl storage dashboard <bucket_name>
```

Or, visit your organization-level overview for billing and organization settings:

```cmd
flyctl storage dashboard --org <org_name>
```

### List your buckets
Get a list of all of your Tigris buckets.

```cmd
flyctl storage list
```
```output
NAME                  	ORG
js-storage-1           	fly-ephemeral
late-surf-5384        	fly-ephemeral
```

### Delete a Tigris bucket

Deleting can't be undone. Empty buckets can't be deleted without the `--force` option.

```cmd
fly storage destroy late-surf-5384
```
```output
Destroying a Tigris bucket is not reversible.
? Destroy Tigris bucket late-surf-5384? Yes
Your Tigris bucket late-surf-5384 was destroyed
```