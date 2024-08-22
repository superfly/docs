---
title: Object Storage
layout: framework_docs
objective: Provision a Tigris Bucket and access it via a `S3Client`
order: 4
---

[Tigris](Tigris is a globally caching, S3-compatible object storage service built on Fly.io infrastructure.) is a globally caching, S3-compatible object storage service built on Fly.io infrastructure.

## Launching a new Application?

If `@aws-sdk/client-s3` is listed as a dependency in your `package.json`, Tigris will be automatically selected by fly launch. This can be overrided this in the launch UI:

![Tigris Launch-UI](/docs/images/tigris-launch-ui.png)

## Adding Tigris to an existing application?

Create a storage bucket using `fly storage create`:

```cmd
fly storage create
```
```output
? Choose a name, use the default, or leave blank to generate one: 
Your Tigris project (xxx) is ready. See details and next steps with: https://fly.io/docs/tigris/

Setting the following secrets on xxx:
AWS_ACCESS_KEY_ID: tid_xxx
AWS_ENDPOINT_URL_S3: https://fly.storage.tigris.dev
AWS_REGION: auto
AWS_SECRET_ACCESS_KEY: tsec_xxxxx
BUCKET_NAME: xxx

Secrets are staged for the first deployment
```

## Usage

Once provisioned, no further configuration is required to access your bucket using the `S3Client` class:

```javascript
const S3 = new S3Client()
```

## Demo

[`node-dictaphone`](https://github.com/fly-apps/node-dictaphone) contains a demo application that captures audio,
uploads the result to a Tigris bucket, where it can be selected and replayed:

```
fly launch --from https://github.com/fly-apps/node-dictaphone.git
```

## Find out more!

Now that you are up and running, there is a lot more to explore on the [Tigris Global Object Storage](/docs/tigris/) page. Highlights include public buckets, migrating to Tigris with shadow butckets, Pricing, and AWS API compatibility.