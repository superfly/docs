---
title: Seamless Deployments on Fly.io
layout: docs
nav: firecracker
author: kcmartin
date: 2025-06-26
---

<figure>
  <img src="/static/images/seamless-deployments.png" alt="Illustration by Annie Ruygt of a balloon doing a health check" class="w-full max-w-lg mx-auto">
</figure>

<div class="callout">
**Zero-downtime deploys aren’t magic. They’re just health checks that work. Fly.io apps run on individual VMs, and we won’t start routing traffic to a new one until it proves it’s alive. Here's how to get seamless deploys without breaking things or relying on hope as a strategy.**
</div>

### Your deploy is only as good as your health checks

Fly.io deployments look like magic when health checks are working. New Machines boot. Old ones go down. Users never notice. But behind the scenes, the [Fly Proxy](/docs/reference/fly-proxy/) is watching your Machines and only sending them traffic if they pass your health checks.

[Health checks](/docs/reference/health-checks/) are how you tell the platform that your app is alive. If they're missing or broken, you're flying in the dark.

In your `fly.toml`, you'll usually define health checks under `http_service.checks` (or the alternative `services.http_checks` if you're not using the http_service shortcut) for HTTP-based apps. These checks are simple: make a request to a path like `/`, expect a `200 OK` response, and fail if you get a redirect or timeout. If your app redirects HTTP to HTTPS, add a header like `X-Forwarded-Proto = "https"` to avoid false failures.

The most common health check failure modes are easy to trip over:

- getting 301/302s instead of 200 responses
- hitting a path that loads slowly under cold start conditions
- forgetting to delay checks with a `grace_period` after boot

A typical HTTP health check might look like this:

```
[http_service.checks]
  interval = "15s"
  timeout = "2s"
  grace_period = "10s"
  method = "GET"
  path = "/healthz"
  headers = { X-Forwarded-Proto = "https" }
```

For apps that aren't serving HTTP, or where you want lighter checks, [TCP health checks](/docs/reference/health-checks/#service-level-checks) exist too. These just attempt to open a socket to the port you've configured; if the connection is accepted, the Machine is healthy.

[Top-level health checks](/docs/reference/health-checks/#top-level-checks)—defined in the `[checks]` section of your `fly.toml`—are for observability, not traffic control. They don't influence routing; if a Machine fails one, we won’t pull it out of rotation. That makes them ideal for internal monitoring and alerting, especially for background workers or other non-public-facing services where you still want to know if something’s gone sideways, but don’t need Fly to reroute traffic automatically.

Deployments get another layer: `machine_checks`. These aren't about routing traffic; they're about catching bad deploys before they go live. A `machine_check` boots a throwaway Machine, sets `FLY_TEST_MACHINE_IP`, and lets you poke it however you want. You can run integration tests, perform simulated traffic, check database access, or validate config. Fail the check, and the deploy halts. This is perfect for canary testing new releases.

**Example:**

```
[services.machine_checks]
  command = ["/bin/bash", "-c", "curl -f http://$FLY_TEST_MACHINE_IP:8080/healthz"]
  interval = "30s"
  timeout = "5s"
```

Note: `machine_checks` run in a temporary Machine with the new image before it's deployed anywhere else. They're isolated, so they won't affect your running app—but they can save you from pushing broken code into production.

If a Machine fails a health check, Fly Proxy pulls it out of the rotation. That Machine can still be running, logging, and debugging, but it's invisible to your users.

### Deployment strategies: choose your own trade-offs

Working with health checks and at least two Machines, you can avoid downtime. The platform won't kill a healthy Machine until a new one is up and running.

Fly.io supports a few deployment strategies in the `[deploy]` section of `fly.toml`:

- **Rolling (default):** Replace Machines one at a time. Use `max_unavailable` to control how many go down at once (e.g., `1` or `25%`).
- **Immediate:** Burn the ships. All Machines update at once, no health checks, hope for the best.
- **Canary:** Start with one Machine. If it's healthy, continue with rolling. This can't be used with attached volumes.
- **Bluegreen:** Boot new Machines alongside old ones. Only switch traffic after all new Machines pass checks. Fastest, safest, but also can't use attached volumes.

You can also define a [`release_command`](/docs/reference/configuration/#run-one-off-commands-before-releasing-a-deployment) to run before any Machines update. It gets a fresh Machine and your new image, but no volume. Use it for migrations or other one-off prep work.

Every deploy also includes a smoke check: Fly watches Machines for \~10 seconds after they start. If they crash repeatedly, the deploy fails.

Don't forget to set `wait_timeout` if your image is big or startup is slow. It's easy to hit timeouts before Machines even start.

### Zero-downtime is a shared responsibility

The Fly.io platform will keep your Machines healthy and traffic flowing. But there's one thing it can't fix: application incompatibility during deploys.

Say you're changing your database schema. You run the migration in a `release_command`, then your Machines update one by one. If the old app code can't handle the new schema, users will see errors while old Machines are still running. Same goes for bluegreen deployments: the new Machines are healthy, but traffic doesn't switch until _all_ of them are.

Fixing this is on you. You need to design schema and app changes that can coexist briefly. That usually means:

- App code that works with both the old and new database schemas
- Migrations that add columns or tables but don't drop or rename until later

Every framework has guidance for this. Read it. Follow it. Then health checks, deployment strategies, and the platform can do their jobs.

Deploying without downtime isn't automatic. But with a little help from your health checks and some care in your app logic, it's well within reach.



### Related reading:

- [Deploy an App](/docs/launch/deploy/)
- [Health Checks](/docs/reference/health-checks/)
