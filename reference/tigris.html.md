---
title: Tigris Global Object Storage
layout: docs
sitemap: false
status: beta
nav: firecracker
---

[Tigris](https://tigrisdata.com) is a globally caching, S3-compatible object storage service built on Fly.io infrastructure.

Objects in Tigris are stored close to the region where they're written. Then, when requested, objects are cached close to the requesting user. This cache is intelligently managed by Tigris based on global traffic patterns. This behavior offers CDN-like behavior with zero configuration required.

Learn more from their [service overview](https://www.tigrisdata.com/docs/overview/) and [architecture docs](https://www.tigrisdata.com/docs/concepts/architecture/).

## Create and manage a Tigris storage bucket

Creating and managing storage buckets happens exclusively via the [Fly CLI](/docs/flyctl/install/). Install it, then [signup for a Fly account](/docs/getting-started/sign-up-sign-in/).

<aside class="callout">Running the following command in a Fly.io app context -- inside an app directory or specifying `-a yourapp` -- will automatically set secrets on your app.</aside>

```cmd
fly storage create
```
```output
? Select Organization: fly-ephemeral (fly-ephemeral)
? Choose a name, use the default, or leave blank to generate one:
Your project (summer-grass-2004) is ready.

Set one or more of the following secrets on your target app.
BUCKET_NAME: summer-grass-2004
AWS_ENDPOINT_URL_S3: https://fly.storage.tigris.dev
AWS_ACCESS_KEY_ID: tid_xxxxxx
AWS_SECRET_ACCESS_KEY: tsec_xxxxxx
```

### Public buckets

By default, buckets are private. If you need to serve public assets like images or javascript files, create a *public bucket*:

```cmd
fly storage create --public
```

You can also make a public bucket private.

```cmd
fly storage update mybucket --private
```

Currently, buckets must be public or private. ACL settings will be ignored by the Tigris API.

### Migrating to Tigris with shadow buckets

A shadow bucket is an existing S3 (or compatible) bucket, assigned to your Tigris bucket via `flyctl`.

Shadow buckets enable transparent copying and writing of objects as they are requested or uploaded. This is helpful for a few scenarios, like:

* Avoiding egress fees from large data migrations
* Avoiding downtime by serving requests from Tigris while running a data migration
* Testing Tigris global cache performance
* Testing Tigris functionality with the option to switch back to your current provider

#### How shadow buckets work

Tigris follows this logic when a shadow bucket is set:

* If a requested object is present in Tigris, it's served immediately
* If not present, Tigris fetches it from the shadow bucket and stores it in a region close to the requesting user
* Subsequent requests are served from Tigris and cached in the requesting user's region
* Written objects are stored in Tigris close to the uploading user's region
* Optionally, written objects are replicated to the shadow bucket
* Deleted objects are removed from both the Tigris and shadow bucket

#### Create a new bucket with a shadow bucket

You must specify all shadow bucket attributes, including the endpoint and region. Check your provider docs to find these values. Here's the AWS S3 [list of regions and endpoints](https://docs.aws.amazon.com/general/latest/gr/s3.html).

```cmd
flyctl storage create -n mybucket -o myorg --shadow-access-key 123 --shadow-secret-key abc --shadow-endpoint https://s3.us-east-1.amazonaws.com --shadow-region us-east-1 --shadow-write-through
```

#### Add or remove a shadow bucket on an existing Tigris bucket

You can also and and remove shadow buckets from existing Tigris buckets.

```cmd
flyctl storage update mybucket --shadow-access-key 123 --shadow-secret-key abc --shadow-endpoint https://s3.us-east-1.amazonaws.com --shadow-region us-east-1

flyctl storage update mybucket --clear-shadow
```

`shadow-write-through` ensures that writes to Tigris buckets are replicated to the shadow bucket.

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

## Pricing and Billing

Tigris buckets are billed by usage with no up-front costs. Check the official [Tigris Pricing](https://www.tigrisdata.com/docs/pricing/) page for details. This pricing can change as data transfer costs are worked out between Fly.io and Tigris.


## AWS API compatibility

Check out the Tigris docs on compatibility: https://www.tigrisdata.com/docs/api/s3

Tigris also supports the following:

* [Pre-signed URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) for secure download and upload
* Setting HTTP headers on objects such as `Cache-Control`