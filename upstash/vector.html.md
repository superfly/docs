---
title: Upstash Vector
layout: docs
nav: firecracker
redirect_from: /docs/reference/vector/
---

<aside class="callout">
This service is in public beta in the `iad` and `fra` regions. We don't recommend using it in production yet. We welcome your feedback!
</aside>

[Upstash Vector](https://docs.upstash.com/vector) is a fully-managed, pay-as-you-go vector database designed for working with vector embeddings.

When using Upstash vector through Fly.io, your index is hosted on Fly.io infrastructure via a private IPv6 address on your Fly.io organization network.

## Create and manage a Vector index

Creating and managing indexes happens exclusively via the [Fly CLI](/docs/flyctl/install/). Install it, then [signup for a Fly account](/docs/getting-started/sign-up-sign-in/).

You need to select a [similarity function](https://upstash.com/docs/vector/features/similarityfunctions) and [embedding model](https://upstash.com/docs/vector/features/embeddingmodels) to create an index. If you're bringing your own vectorization, you need to choose the index dimension count.

Learn more in the official [Upstash Vector documentation](https://upstash.com/docs/vector/overall/getstarted).

### Create and get status of a Vector index

```cmd
flyctl ext vector create
```
```output
? Select Organization: myorg (myorg)
? Select a similarity function: Euclidean Distance (Natural Language Processing, Recommendation Systems)
? Select an embedding model: WhereIsAI/UAE-Large-V1
? Choose a name, use the default, or leave blank to generate one: my-vector-index


? Choose the primary region (can't be changed later) Ashburn, Virginia (US) (iad)
Your Upstash Vector index (my-vector-index) in iad is ready.

Set the following secrets on your target app.
VECTOR_ENDPOINT: my-vector-index-fly-vector.upstash.io
VECTOR_READONLY_TOKEN: token
VECTOR_TOKEN: token
```

### The Upstash web console

To view more details about your index, including usage, run:

```cmd
flyctl ext vector dashboard -o <org_name>
```

### List your indexes and view status
Get a list of all of your Vector indexes.

```cmd
flyctl ext vector list
```
```output
NAME               	ORG          	PRIMARY REGION
my-vector-index	myorg         	iad
```

Fetch status for an index:

```cmd
fly ext Vector status my-vector-index
```
```output
RStatus
  Name   = my-vector-index
  Status = created
```

### Using your Vector index

To start using your index, check the documentation for the [Vector REST API](https://upstash.com/docs/vector/api/get-started) and [example applications](https://upstash.com/docs/vector/examples).

### Delete a Vector index

Deleting a Vector index can't be undone. Be careful!

```cmd
fly ext vector destroy my-index
```
```output
Your vector index my-index was deleted
```

## What you should know

Once provisioned, the index primary region cannot be changed.

Your index is accessible only via a [private IPv6 address](/docs/networking/flycast/) restricted to your Fly.io organization's network.

**To ensure low latency connections, provision your index in the same region as your application.**

## Pricing

Upstash Vector indexes are billed by usage on a pay-as-you-go basis. Check the official [Upstash Pricing](https://upstash.com/pricing/vector) page for details.

Your usage is visible on your current Fly.io bill, and updated periodically through the day. See detailed index usage details in the [Upstash web console](#the-upstash-web-console).
