---
title: Databases and storage
layout: docs
toc: true
nav: firecracker
---

<figure class="flex justify-center">
  <img src="/static/images/database-storage.png" alt="Illustration by Annie Ruygt of a tiger sleeping next to a storage device" class="w-full max-w-lg mx-auto">
</figure>


## Managed database service

[Fly.io Managed Postgres](/docs/mpg/) is a production-ready Postgres service that handles the hard parts for you: high availability, automatic failover, encrypted backups, monitoring and metrics, seamless scaling, and 24/7 support to keep your data fast, safe, and always online.

## Key-value stores

**[Upstash for Redis](/docs/upstash/redis/)** - [Redis](https://redis.io/+external) is an in-memory database commonly used for caching. A managed service by [Upstash](https://upstash.com/+external).

---

## Fly Volumes - Disk storage

The Fly Machines in your app provide ephemeral storage, so you get a blank slate on every startup. For hardware-local, persistent storage on Fly.io, use Fly Volumes. You can attach volumes on an app directly, or run a separate database app with volume storage and connect an app to that.

**[Fly Volumes](/docs/volumes/):** A Fly Volume is a slice of NVMe disk storage attached to the server that hosts your Machine. Read the [Fly Volumes overview](/docs/volumes/overview/) to find out if volumes are the best solution for your use case.

## Object storage service

**[Tigris Global Object Storage](/docs/tigris/)** - [Tigris](https://www.tigrisdata.com/+external) is a globally distributed S3-compatible object storage service hosted on Fly.io infrastructure.

---

## Have a project with special database or storage requirements?

If your project calls for something else, most external databases and storage providers work well with Fly.io. You might just need to spend a bit more time wiring up the networking.