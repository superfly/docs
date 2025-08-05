---
title: Building Infrastructure Automation without Terraform
layout: docs
nav: firecracker
author: kcmartin
date: 2025-08-05
---

## Overview

We don’t have a Terraform provider anymore, and that’s intentional. It’s not a great fit for how our platform works. This guide is about how to get a Terraform-like experience using the tools that do fit.

If you're used to defining infrastructure declaratively, using templated variables, repeatable workflows, a single source of truth, you can absolutely have that on Fly.io. But you’ll get there by thinking a little differently: using tools built around our actual primitives instead of trying to bend them to fit a plan/apply model. If you're looking for a good path forward, you've got options.

This guide walks through two options for automating Fly.io deployments without Terraform.

The first uses `flyctl` and GitHub Actions. It’s what we recommend for most users: push to `main`, your app gets deployed. No infra state to manage, no VMs to track. Just code and Git.

The second uses the Machines API directly. It’s more work, but gives you full control over each virtual machine. You’ll need this if you’re doing custom orchestration like rolling deploys across regions, temporary environments, or using fine-tuned scaling logic.

We’ll show you how both approaches work and help you figure out which one makes sense for your setup.

---

## The easy way: `flyctl` + GitHub Actions

This is the path most Fly.io apps take, and it’s what we recommend. You write code, you push to `main`, your app gets deployed. It’s quick to set up, and it abstracts away the VM lifecycle stuff unless and until you want it.

Here’s the gist:

1. Get your app running on Fly.io
1. Push the code to a GitHub repo
1. Wire up a GitHub Actions workflow that calls `flyctl deploy`

That’s it. Here’s what setting that up looks like.

### Step 1: Generate a deploy token

```
fly tokens create deploy --app <app-name>
```

Treat that token like a password. Copy it somewhere safe—you’ll need it for GitHub.

### Step 2: Add it to your GitHub repo

In GitHub:

- Go to your repo > Settings > Secrets and variables > Actions
- Add a new secret named `FLY_API_TOKEN`
- Paste in the deploy token

### Step 3: Write the workflow file

Drop this into `.github/workflows/fly.yml` in your repo:

```
name: Fly Deploy

on:
  push:
    branches:
      - main  # or your default branch

jobs:
  deploy:
    name: Deploy app
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Push that file, and your next `git push` to `main` will kick off a deployment. You can watch it happen in the Actions tab.

The `--remote-only` flag tells `flyctl` to build your image on Fly.io’s remote builders, so your CI environment doesn’t need Docker.

From here on out, you’ve got continuous deployment. Push to `main`, app goes live.

A realistic example: you’re running a Rails app backed by Postgres and Redis, deployed to `iad` and `lhr`. It lives in a monorepo, and you want each push to `main` to trigger a deployment. The `flyctl` + GitHub Actions setup gets you continuous deployment. You'll handle the supporting infrastructure  imperatively (think databases, IP addresses, scaling): `fly pg create`, `fly redis create`, `fly scale count`, `fly ips allocate`, and so on. The platform keeps track of what you’ve configured, so you don’t need to re-declare it every time.

<div class="callout">
**Tip:** If you want a repeatable setup, you can script your commands into a bash file. Just be aware: that script will be linear and imperative, not declarative or idempotent like a Terraform plan.
</div>

---

## The harder way: The Machines API

This is the route for teams who were doing more than `terraform apply`. If you had logic layered into your infra automation like canary deploys, ephemeral environments, controlling exactly which VM runs where, you’ll want to look at the Machines API. It’s lower-level, but more powerful. Think of it as Fly.io’s bare-metal interface. No `plan`, no `state`, no `graph`, just HTTP.

You can use it to:

- Spin up new Machines in specific regions
- Roll out changes a Machine at a time
- Build custom scaling logic
- Tear down and rebuild environments on demand

This is what Fly.io’s own orchestration tools use under the hood. You can spin up Machines, wire them together, and orchestrate them across regions, just like we do. You've got all the same knobs and levers we use internally, and you can build exactly the kind of workflow your setup needs.

### What you're working with

The Machines API is a REST interface. It speaks JSON over HTTPS. You authenticate using a [Fly.io API token](https://fly.io/docs/security/tokens/), ideally a deploy token scoped to your app or organization. Pass it as a `Bearer` token in the `Authorization` header. If you've used GitHub Actions to deploy with `flyctl`, it's the same kind of token.

Each Fly App is a namespace. You can create as many Machines (VMs) as you want in an App. Each Machine runs a Docker image, has a region, some resource settings, and a lifecycle: create → start → stop → destroy.

You don’t need special tooling to use it. `curl` works. So does `fetch`, `requests`, `httpie`, or whatever HTTP client you like in Go or Rust or Python. Everything you might script with `flyctl`, like creating databases, setting scale counts, can also be done via the Machines API. It’s more verbose, but gives you full control and makes it easier to integrate infrastructure setup into a larger orchestration flow.

### Example: spin up a Machine with curl

```
export FLY_APP_NAME="your-app-name"
export FLY_API_TOKEN="your-fly-token"

curl -i -X POST \
  -H "Authorization: Bearer ${FLY_API_TOKEN}" \
  -H "Content-Type: application/json" \
  "https://api.machines.dev/v1/apps/${FLY_APP_NAME}/machines" \
  -d '{
    "region": "sjc",
    "config": {
      "image": "nginx",
      "guest": {
        "cpu_kind": "shared",
        "cpus": 1,
        "memory_mb": 256
      }
    }
  }'
```

The response includes the ID of the new Machine. You can then start, stop, or destroy it by hitting `/machines/{id}` with the appropriate verb.

### When to reach for the API

Most apps don’t need this. But if you’re building something dynamic, like spinning up short-lived browser-based dev environments or launching ephemeral multiplayer game servers, then you’ll want this kind of control.

Some of our favorite real-world uses:

- A “run this one function on a new machine” pattern, demoed in [this JS repo](https://github.com/fly-apps/fly-run-this-function-on-another-machine). It boots a new Machine in-region, runs a job, and tears it down. Works like serverless, but with a full VM and no cold starts.
- A minimal Go client for the Machines API, [`sosedoff/fly-machines`](https://github.com/sosedoff/fly-machines), has helpers to create, update, and destroy Machines programmatically. If you’re replacing Terraform logic with your own Go-based orchestration, this is a good lightweight example. For something more comprehensive, check out our official fly Go SDK, [`superfly/fly-go`](https://github.com/superfly/fly-go), for tighter integration with the platform.

The Machines API doesn’t lock you into a flow, we just give you the primitives.

**Still not sure? Here's the comparison.**

| Feature | `flyctl` + GitHub Actions | Machines API |
| --- | --- | --- |
| Best for | Standard apps, CI/CD | Custom infra, dynamic environments |
| Setup time | Fast | Slower |
| Complexity | Low | High |
| Control | Abstracted (`deploy`, `scale`) | Full (`create`, `start`, `destroy`) |
| Official support | Fully supported & recommended | Fully supported & documented |

## One last thing

We know it sucks when a tool you relied on gets deprecated. Terraform made a lot of things feel clean and declarative. But when it comes to the Machines API specifically, Terraform was always working at a bit of a mismatch since it tries to express an inherently imperative lifecycle in a declarative model. The Machines API gives you fine-grained control and flexibility that didn’t map cleanly to Terraform's abstractions. With a little effort, you can build exactly what you need, and avoid being boxed in by someone else’s idea of what an app should look like.

If you're rebuilding that tooling now, let us know what you're working on. We might be able to help, or at least learn something from it.
