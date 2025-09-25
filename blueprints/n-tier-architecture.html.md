---
title: Getting Started with N-Tier Architecture
layout: docs
nav: guides
author: kcmartin
date: 2025-08-29
---

<figure>
  <img src="/static/images/get-started-n-tier.png" alt="Illustration by Annie Ruygt of a bird slicing a loaf of bread-think app layers" class="w-full max-w-lg mx-auto">
</figure>

## What is n-tier architecture?

When people talk about “**n-tier architecture**,” they’re describing a way of splitting an app into layers (or “tiers”) that each have a specific job. The “**n**” just means there could be two, three, or more tiers depending on how you slice things.

---

## Defining tiers

- **Presentation tier**: the UI/frontend of your app — HTML/CSS/JS in a browser, or a mobile app interface — that the user interacts with
- **Web tier**: the app servers/backend that [handle requests](/docs/networking/dynamic-request-routing/) and run business logic
- **Data tier**: stores, manages and provides access to application data

---

## N-Tier Examples 

### Two tiers 

**web app + database**. This is the most common case on Fly.io: your app servers run on Fly Machines and connect to a shared Postgres cluster.

### Three tiers

**frontend + backend + database**. You’ll see this if you have a separate frontend (like a React SPA served from a CDN, or a mobile app) that talks to your Fly backend.

### Mapping to Fly.io

- **Web tier** → your app running on Fly Machines
- **Data tier** → [Fly Managed Postgres](/docs/mpg/) (our hosted Postgres that handles the messy parts for you)
- **Optional presentation tier** → a separate frontend app (web or mobile) that talks to your Fly backend

The idea is simple but powerful: the web tier doesn’t keep state. All shared state lives in the data tier, so you can add or remove servers at will without breaking anything. It’s the architecture you want if you care about **scalability** (handling more traffic by adding machines) and **reliability** (requests keep flowing even if one machine goes down).

---

## Why use n-tier on Fly.io?

- **Scale with one command**: Add more Web/App machines whenever traffic spikes.
- **Keep requests flowing**: Fly’s proxy automatically balances load across your Machines.
- **Let the database do its job**: With [Managed Postgres](/docs/mpg/), you don’t need to worry about setup, backups, or failover.

You could use Redis, Tigris, or other data stores here too, but if you’re not sure, start with Managed Postgres. It’s the default choice for good reason.

---

## Quickstart: Deploying a n-Tier App

Let’s spin up a simple n-tier setup.

### 1. Launch your app

First, deploy your app to Fly:

```bash
fly launch
fly deploy
```

This gives you the **web tier**.

---

### 2. Add a database (Managed Postgres)

Now create your **data tier** with [Fly Managed Postgres](/docs/mpg/):

```cmd
fly mpg create
```

This will:

- Provision a new Postgres cluster in the same region as your app to keep latency to a minimum (though you can choose another region).
- Configure monitoring, daily backups, and automatic failover.

To connect your app, you’ll need to add the database credentials as secrets. You can do this from the Fly.io Dashboard, or with `flyctl`:

```cmd
fly secrets set DATABASE_URL=postgres://<user>:<password>@<host>/<dbname>
```

Most frameworks (Rails, Django, Node, etc.) will automatically read `DATABASE_URL` from the environment. Once set, your app is ready to talk to Postgres.

More details on creating and connecting a managed Postgres database can be found [here](/docs/mpg/create-and-connect/).

---

### 3. Scale out your web tier

If traffic grows, add more Machines:

```cmd
fly scale count 3
```

[Fly’s proxy](/docs/reference/fly-proxy/) takes care of spreading requests across the machines (load balancing).

**Note:** Scaling works best when your web tier is **stateless**. Any shared data like file uploads, user sessions/cookies, or cached state should live in your data tier (usually Managed Postgres, sometimes object storage or Redis). If your framework defaults to local disk or memory for these, configure it to use a shared store instead.

---

## Finishing up

At this point you’ve got:

- **Optional presentation tier**: a separate frontend app, if you use one (delivered to browsers or devices)
- **Web tier**: Fly Machines running your app (stateless and load balanced)
- **Data tier**: [Fly Managed Postgres](/docs/mpg/)

Every request can hit any Machine, and all Machines share the same Postgres. That’s an n-tier architecture in action, and it’s the foundation for most reliable web apps.

---

## Next steps and related reading

- Explore the features of [Fly Managed Postgres](/docs/mpg/) 
- Find out how to [scale apps on Fly](/docs/launch/scale-count/)
- Read about [Fly networking](/docs/networking/) 
- Learn more about [n-tier architecture](https://en.wikipedia.org/wiki/Multitier_architecture#Three-tier_architecture)
