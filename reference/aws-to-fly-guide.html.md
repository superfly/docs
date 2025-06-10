---
title: Migrating from AWS to Fly.io Overview
layout: docs
nav: firecracker
author: kcmartin
date: 2025-06-09
---

<div class="callout">
**Fly.io runs apps close to your users, by giving you fast-starting VMs ("Fly Machines") in 30+ regions worldwide.** This guide is for folks moving apps from AWS. It walks through the major architectural differences you'll hit and how to adjust your deployment model.
</div>


Migrating from AWS to Fly.io means rethinking a few assumptions. The two platforms run apps differently, wire networks differently, and give you different tools to scale and persist data. This is a whirlwind tour of what changes when you leave the AWS cloud mothership.

### Compute

First up: compute. Fly.io runs apps as virtual machines, but it doesn't use AMIs or EC2. Instead, you give us a Docker image, we unpack it, and that becomes the root filesystem for a VM we spin up for you. We call these [Fly Machines](/docs/machines/overview/). They're fast. And they're small. And they boot fast because there's no hypervisor cold-start time and no shared kernel games like you'd find in ECS or EKS.

But here's the catch: unless you mount a volume, the root filesystem is ephemeral. It disappears on restart. Any data written there is toast unless you store it somewhere else. If your app currently depends on an EBS volume or even just writes temp files it expects to survive a restart, you'll need to rethink that.

### Storage

[Fly Volumes](/docs/volumes/overview/) are our answer to persistent storage. They're slices of NVMe mounted directly on the physical host. They're not network-attached. This means they're fast and simple, but they're tied to a specific host. If your machine dies, you can boot another and reattach the volume. Think EBS, minus the network indirection and regional abstraction. You can also store large static assets like ML models in volumes, which keeps your Docker images lean and your deploys snappy.

For object storage, we offer [Tigris](/docs/tigris/). It's S3-compatible and runs on Fly.io itself. If you're migrating from AWS S3, there's a handy [shadow bucket](/docs/tigris/#migrating-to-tigris-with-shadow-buckets) mode: Tigris can fall back to fetching from your existing S3 bucket if a file isn't yet copied over. First request pulls from S3; future requests hit local. Writes are synced, too, which makes a gradual migration painless.

### Networking

Talking to AWS-hosted services, like RDS, takes a bit of finessing. There's no direct WireGuard bridge into your AWS VPC. If you want to connect to RDS securely, the simplest approach is to run PgBouncer as a Fly Machine with a static egress IP. Allowlist that IP in your RDS security group. Then your app machines connect to PgBouncer over Fly's private network, and it forwards to RDS.

Speaking of [networks](/docs/networking/): Fly.io apps live on an isolated private network per org, connected over WireGuard. Machines talk to each other via `.internal` hostnames (direct) or `.flycast` (load-balanced via our proxy). This setup is pretty close to private subnets and security groups in AWS. You usually only expose your edge-facing apps to the public internet.

Instead of regional load balancers, we use [Anycast](/docs/networking/services/#anycast-ip-addresses). Your DNS points to one global IP. The Fly Proxy routes requests to the nearest edge server, which forwards traffic to a healthy app instance based on load and latency. That means no more manually balancing between `us-east-1` and `us-west-2`.

### Scaling

Scaling works differently too. Machines are not created on-demand based on request traffic. You provision them up front, and we start/stop them as needed. That means your max spend is predictable. Want [autoscaling](/docs/reference/autoscaling/)? Monitor metrics via Prometheus, and scale using flyctl or an API client. You own the automation.

### Deployments and Secrets

Which brings us to Infrastructure-as-code (IaC). Most users glue things together with Bash scripts and `flyctl`, and manage state by convention. It's low-friction but low-abstraction. And it’s still less of a headache than CloudFormation.

On the plus side, deployments can be zero-downtime if you use [health checks](/docs/reference/health-checks/) and run multiple machines. Define those health checks in `fly.toml`, and the proxy will route around unhealthy nodes. You can even run DB migrations with a `release_command` before a deploy, and roll back by pushing a previous image tag.

Secrets? Use [Fly Secrets](/docs/apps/secrets/). They get mounted as env vars at runtime and stay encrypted at rest. Similar to AWS Secrets Manager or Parameter Store, but simpler. We also have a new Secrets API that works like AWS KMS to allow apps to encrypt/decrypt data with centrally-managed keys.

### Databases

Databases? We offer [Fly Postgres](/docs/postgres/). The original offering is not a managed service like RDS—you manage backups, upgrades, and failovers—but creation is automated and it's tightly integrated with Fly.io networking. Other database options include managed Redis from our partner Upstash, running your own Redis or Valkey, distributed SQLite via LiteFS, or vector DBs like LanceDB with Tigris.

### Monitoring

For [monitoring](/docs/monitoring/metrics/), you get Prometheus metrics and Grafana dashboards. There's no native alerting yet, but many folks run their own Prometheus with Alertmanager, or use Grafana to set up alerts. This involves more user setup compared to AWS CloudWatch alarms, but you gain a wealth of resources from the Grafana and Prometheus communities.

### In a nutshell

AWS is a sprawling platform with deep abstractions. Fly.io strips a lot of that away. You get rawer access to your infra and better latency for your users, but you might trade some convenience. Migration is generally less about translating concepts and more about rethinking how your app is built and deployed.