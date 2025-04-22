---
title: Per-User Dev Environments with Fly Machines
layout: docs
nav: firecracker
date: 2025-04-02
---

Fly Machines are fast-launching VMs behind [a simple API](https://fly.io/docs/machines/api), enabling you to launch tightly isolated app instances in milliseconds [all over the world](https://fly.io/docs/reference/regions/).

One interesting use case: running isolated dev environments for your users (or robots). Fly Machines are a safe execution sandbox for even the sketchiest user-generated (or LLM-generated) code.

This blueprint explains how to use Fly Machines to securely host ephemeral development and/or execution environments, complete with [dynamic subdomain routing](https://fly.io/docs/networking/dynamic-request-routing) using `fly-replay`.

## Overview

Your architecture should include:

- **Router app(s)**
    - A Fly.io app to handle requests to wildcard subdomains (`*.example.com`). Uses `fly-replay` headers to transparently redirect each request to the correct app and machine. If you have clusters of users (or robots) in different geographic regions, you can spin up a router app in multiple region to increase reliability and reduce latency (you might also want to consider a globally distributed datastore like [Upstash for Redis](https://fly.io/docs/upstash/redis/#what-you-should-know)). 
- **User apps (pre-created)**
    - Dedicated per-user (or per-robot) Fly apps, each containing isolated Fly Machines. App and Machine creation is not instantaneous, so we recommend provisioning a pool of these before you need them so you can quickly assign upon request.
- **Fly Machines (with optional volumes)**
    -  Fast-launching VMs that can be attached to persistent [Fly Volumes](https://fly.io/docs/volumes).

### Example Architecture Diagram

<img src="/static/images/docs-sandbox-architecture.webp" alt="Diagram showing router app directing traffic to user apps containing Fly Machines with volumes">

### Router app(s)

Your router app handles all incoming wildcard traffic. Its responsibility is simple:

- Extract subdomains (like `alice.example.com` → `alice-123`).
- Look up the correct app (and optionally machine ID) for that user.
- Issue a `fly-replay` header directing the Fly Proxy to [internally redirect the request](https://fly.io/docs/networking/dynamic-request-routing) (this should add no more than ~10 milliseconds of latency if the router app is deployed close to the user).
- When appropriate, use [replay caching](https://fly.io/docs/networking/dynamic-request-routing/#replay-caching) to further reduce latency and load on the router app.
- Make sure you've added [a wildcard domain](https://fly.io/docs/networking/custom-domain/#get-certified) (*.example.com) to your router app (read more about the [certificate management endpoint here](https://fly.io/docs/networking/custom-domain-api/)).

### User apps

Creating apps dynamically for each user at request time can be slow. To ensure fast provisioning:

- **Pre-create** a pool of Fly apps and machines ahead of time (using the [Fly Machines API or CLI](https://fly.io/docs/apps/overview/)).
- Store app details (e.g., app_name: `alice-123`) in a datastore accessible to your router app.
- Assign apps to users at provisioning time.

**Fly Machines**

You'll want to spin up at least one Machine per user app (but apps can have as many Machines as needed). If your dev environments need persistent storage (data that should survive Machine restarts):

- Attach Fly Volumes to each machine at creation time.
- Keep in mind that machine restarts clear temporary filesystem state but preserve volume data.
- Learn more about the [Machines API resource](https://fly.io/docs/machines/api/machines-resource/) and the [Volumes API resource](https://fly.io/docs/machines/api/volumes-resource/). 

## Pointers & Footguns

- **Machines & volumes are tied to physical hardware:** hardware failures can destroy machines and attached volumes. **Always persist important user data** (code, config, outputs) to external storage (like [Tigris Data](https://fly.io/docs/tigris/#main-content-start) or AWS S3).
- **Your users will break their environments:** pre-create standby machines to handle hardware & runtime failures, or the inevitable user or robot poisoned environment. Pre-create standby machines that you can quickly activate in these scenarios.
- **Machine restarts reset ephemeral filesystem:** the temporary Fly Machine filesystem state resets on Machine restarts, ensuring clean environments. However, volume data remains persistent, making it useful for retaining user progress or state.
