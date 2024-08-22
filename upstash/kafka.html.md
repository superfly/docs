---
title: Upstash Kafka
layout: docs
nav: firecracker
redirect_from: /docs/reference/kafka/
---

<aside class="callout">
This service is in public beta in the `iad` and `fra` regions. We don't recommend using it in production, but highly encourage testing with real workloads. Help us make this service shine!
</aside>

[Upstash Kafka](https://docs.upstash.com/kafka) is a fully-managed, pay-as-you-go Kafka service hosted on Fly.io infrastructure.

## Create and manage a Kafka cluster

Creating and managing clusters happens exclusively via the [Fly CLI](/docs/flyctl/install/). Install it, then [signup for a Fly account](/docs/getting-started/sign-up-sign-in/).

### Create and get status of a Kafka cluster

```cmd
flyctl ext kafka create
```
```output
? Select Organization: fly-apps (fly-apps)
? Choose a name, use the default, or leave blank to generate one: my-kafka-cluster
? Choose a primary region (can't be changed later) Madrid, Spain (mad)

Your Upstash cluster (my-kafka-cluster) in iad is ready.

Set the following secrets on your target app.

KAFKA_PASSWORD: MThl0io456uil345u-jkh34-kuj
KAFKA_USERNAME: Y02kghq4ka345uj0-kl340hkl23
TCP_ENDPOINT: my-kafka-cluster-kafka.upstash.io:9092
```

### The Upstash web console

To view more details about your cluster, including usage, run:

```cmd
flyctl ext kafka dashboard -o <org_name>
```

### List your clusters and view status
Get a list of all of your Kafka clusters.

```cmd
flyctl ext kafka list
```
```output
NAME               	ORG          	PRIMARY REGION
late-waterfall-1133	fly-apps     	mad
```

Fetch status for a cluster:

```cmd
fly ext kafka status late-waterfall-1133
```
```output
RStatus
  Name   = late-waterfall-1133
  Status = created
```

### Using your Kafka cluster

To start using your cluster, you can create Kafka topics via the [Upstash console](https://upstash.com/docs/kafka/overall/getstarted#create-a-topic) or through a Kafka client connecting from your Fly.io organization.

Check Upstash documentation on [creating a topic](https://upstash.com/docs/kafka/overall/kafkaapi#create-a-topic), [producing messages](https://upstash.com/docs/kafka/overall/kafkaapi#produce-a-message) and [consuming messages](https://upstash.com/docs/kafka/overall/kafkaapi#consume-messages).


### Delete a Kafka cluster

Deleting a Kafka cluster can't be undone. Be careful!

```cmd
fly ext kafka destroy my-cluster
```
```output
Your Kafka cluster my-cluster was deleted
```

## What you should know

Once provisioned, the cluster primary region cannot be changed.

Your Upstash Kafka is accessible only via a [private IPv6 address](/docs/networking/flycast/) restricted to your Fly.io organization's network.

**To ensure low latency connections, provision your cluster in the same region as your application.**

## Pricing

Upstash Kafka clusters are billed by usage on a pay-as-you-go basis. Check the official [Upstash Pricing](https://upstash.com/pricing/kafka) page for details.

Your usage is visible on your current Fly.io bill, and updated periodically through the day. See detailed cluster usage details in the [Upstash web console](#the-upstash-web-console).
