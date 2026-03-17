---
title: Troubleshoot your deployment
layout: docs
nav: firecracker
---

<figure class="flex justify-center">
  <img src="/static/images/troubleshooting.png" alt="Illustration by Annie Ruygt of a figure looking through a magnifying glass at a balloon" class="w-full max-w-lg mx-auto">
</figure>

This page covers the most common problems people hit on Fly.io and how to fix them. If your problem isn't here, check the [community forum](https://community.fly.io/).

## Try this first

If the error isn't obvious, start here.

- **Update flyctl:** `fly version update` — outdated versions cause weird failures.
- **Run diagnostics:** `fly doctor` — checks WireGuard, IPs, and Docker.
- **Review fly.toml:** Run `fly config validate` to catch syntax and configuration errors. Double-check formatting, [port numbers](#your-app-isnt-listening-on-the-right-address), and recent changes against the [configuration reference](/docs/reference/configuration/).
- **Check logs:** `fly logs` in one terminal while running your command in another. For more detail: `LOG_LEVEL=debug fly deploy`.
- **SSH in:** `fly ssh console` (use `-s` to pick a specific Machine).

## Find your problem

- **I'm getting an error code**
    - [502 Bad Gateway](#502-bad-gateway) — app didn't respond to the proxy
    - [503 Service Unavailable](#503-service-unavailable) — no healthy Machines
    - [401 Unauthorized](#registry-401-errors) — registry auth failure during deploy
    - [403 Forbidden](#403-forbidden) — usually your app's CORS config or a third-party block
    - [520 with Cloudflare](#520-errors-with-cloudflare) — Cloudflare doesn't like the response
- **My deploy failed**
    - [Build hangs at 'Waiting for depot builder...'](#build-hangs-waiting-for-depot-builder)
    - [Release command failures](#release-command-failures)
    - [Container registry rate limits](#container-registry-rate-limits)
    - ["App is not listening on the expected address"](#your-app-isnt-listening-on-the-right-address)
    - [Missing secrets or env vars](#missing-secrets-or-environment-variables)
    - [Image too large](#image-size-limit)
    - [Health checks failing on deploy](#health-checks-failing)
- **My app is slow or timing out**
    - [Cold starts after deploy or wake-up](#cold-starts)
    - [Health check grace period too short](#grace-period)
    - [Out of memory or high CPU](#out-of-memory-or-high-cpu)
    - [Suspend vs stop (clock skew)](#suspend-vs-stop)
- **I can't connect to something**
    - [Custom domain TLS errors](#custom-domains-and-tls)
    - [Flycast redirect loops or TCP issues](#flycast-internal-load-balancing)
    - [Outbound TCP connections failing](#outbound-connections)
    - [POST requests getting 403'd](#cors-issues)
    - [Can't reach Managed Postgres externally](#managed-postgres)
    - [Redis/Valkey connection errors (IPv6)](#redis-and-valkey)
    - [Volume/disk corruption](#volumes-and-disk-errors)
- **My Machine is stuck or behaving unexpectedly**
    - [Machine stuck in a state](#stuck-machines)
    - [Machine stops immediately after starting](#machines-stop-immediately-after-starting)
    - [Suspend vs stop tradeoffs](#suspend-vs-stop)
    - [What the /init process does](#the-init-process)
- **I can't access the dashboard or my account**
    - [GitHub SSO issues](#cant-log-in-github-sso)
    - [Token problems](#token-issues)
- **My app is down in a specific region**
    - [Regional issues and mitigation](#regional-issues)

---

## Error codes

### 502 Bad Gateway

The Fly proxy reached your Machine, but your app didn't respond correctly. Common causes:

- Your app crashed mid-request
- Your app is [listening on the wrong port](#your-app-isnt-listening-on-the-right-address)
- The Machine is mid-deploy and your app isn't ready yet

Check `fly logs` first. If you see 502s right after deploy, your app probably needs more startup time — increase your [health check grace period](#grace-period). If it's intermittent, check for OOM kills in your logs or SSH in and check memory usage with `free` or `htop.`

OOM kills look like crashes to the proxy. If your Machine is running out of memory, [add more RAM](#out-of-memory-or-high-cpu).

### 503 Service Unavailable

No healthy Machines are available. Either all your Machines are stopped, they're failing health checks, or there's a [regional issue](#regional-issues).

```
fly status
```

If Machines show `started` but you're still getting 503s, health checks are probably failing. Run `fly checks list` to see health check results. Errors like "connection refused" won't appear in `fly logs`. Try checking both. See [Health checks failing](#health-checks-failing).

If all Machines are stopped and you expect auto-start to wake them, verify your `[[services]]` or `[http_service]` config — auto-start only works when the proxy knows where to route traffic. See [Autostart and autostop](/docs/launch/autostop-autostart/).

### Registry 401 errors

```
failed to push registry: 401 Unauthorized
```

This shows up during `fly deploy`. Two possible causes:

1. **Your auth token is stale.** Fix it:
```
fly auth logout
fly auth login
```

1. **A Fly registry incident.** Check [status.flyio.net](https://status.flyio.net). If there's an active incident, wait it out or subscribe for updates.

Note the image size limits: **8GB** for standard Machines, **50GB** for GPU Machines. If your image exceeds these limits, the push fails.

### 403 Forbidden

A 403 can come from different places:

**From your app's CORS configuration:** The Fly proxy does not enforce CORS or act as a WAF. If you're seeing `403 Invalid CORS request`, that's coming from your application's CORS middleware, not from Fly. Check your app's CORS configuration and make sure the `Origin` header your client sends is in your allowed origins list.

**From third-party APIs (outbound):** If your app calls external APIs and gets 403s, the third party may be blocking Fly's IP ranges. This is common with Cloudflare-protected services. Fix: allocate an app-scoped egress IP with `fly ips allocate-egress` so your outbound traffic comes from a consistent IP you can allowlist, or contact the third-party service. You can read more about [app-scoped egress IPs](/docs/networking/egress-ips/#static-egress-ips-app-scoped), as well as [some caveats](/docs/networking/egress-ips/#caveats).

**From object storage:** S3-compatible storage returns 403 on permission issues. Double-check your bucket policy, access keys, and region configuration.

### 520 errors with Cloudflare

520 is a Cloudflare-specific code: "web server returned an unexpected response." When using Cloudflare in front of Fly, this usually means Fly's proxy sent a response header that Cloudflare doesn't understand. The `TE: trailers` header is a known culprit.

If you're using Cloudflare:

- Set SSL mode to **Full (strict)**
- Check your [Cloudflare](/docs/networking/understanding-cloudflare/) proxy settings
- If 520s are intermittent, they may correlate with specific response headers from your app

Note: if Cloudflare itself goes down, your Fly-hosted apps behind Cloudflare go down too. Fly is still running — the CDN in front of it isn't.

---

## Deployment failures

### Build hangs: Waiting for depot builder...

Remote builds use Depot. When Depot is having issues, `fly deploy` hangs.

Quick fix — switch to the legacy remote builder:

```
fly deploy --depot=false
```

This bypasses Depot but still builds remotely. If remote builds are down entirely, build on your own machine:

```
fly deploy --local-only
```

This requires Docker installed locally. Slower on upload, but doesn't depend on any remote build infrastructure.

If your build fails with `exit code: 1`, that's your Dockerfile failing — not a Fly problem. Debug it locally:

```
docker build .
```

### Release command failures

[Release commands](/docs/reference/configuration/#deploy) run in an ephemeral Machine before your app starts.

```
error running release_command machine: machine not found
```

This is usually a platform timing issue. Retry the deploy. If it persists, check `fly logs` to see why the release command Machine is exiting early.

```
failed to get manifest
```

The image hasn't propagated to the registry yet. This happens with two-stage deploys (build + push in one command, deploy in another). Wait about a minute between stages, or retry.

### Container registry rate limits

```
too many requests
```

Fly has a caching proxy for Docker Hub pulls, so Docker Hub rate limits rarely affect builds. However, images hosted on other registries (like GitHub Container Registry) don't go through this cache and can hit rate limits.

Options:

- Build locally: `fly deploy --local-only`
- Use the legacy builder: `fly deploy --depot=false`
- Push your image to a private registry or Docker Hub (which benefits from the cache), then deploy with `fly deploy --image <your-registry/image:tag>`

### Missing secrets or environment variables

If your app crashes on startup complaining about missing config:

```
fly secrets list
fly config env
```

Secrets set with `fly secrets set` are available as environment variables at runtime. They're not available at build time. If you need build-time values, use `[build.args]` in `fly.toml`. Find out more about build-time secrets [here](/docs/apps/build-secrets/).

### Image size limit

Standard (non-GPU) Machines have an **8GB rootfs limit**. GPU Machines allow up to **50GB**.

If your image is too large:

- Use multi-stage Docker builds to drop build dependencies
- Move large assets to a [volume](/docs/volumes/) or object storage
- Check for accidentally included files — add a `.dockerignore`

### Buildpack deploys

Buildpacks work but Dockerfiles are more reliable and give you more control. If you're hitting buildpack issues, consider switching. The `fly launch` command generates a Dockerfile for most frameworks.

---

## Your app isn't listening on the right address

You'll see this during deploy:

```
WARNING The app is not listening on the expected address
and will not be reachable by fly-proxy.
```

Your app must listen on `0.0.0.0` (not `localhost`, not `127.0.0.1`) on the port specified by `internal_port` in your `fly.toml`.

If your `fly.toml` says:

```
[http_service]
  internal_port = 8080
```

Then your app must listen on `0.0.0.0:8080`.

**Common mistakes:**

- Listening on `127.0.0.1` or `localhost` — this only accepts connections from inside the Machine. The Fly proxy connects from outside, so it can't reach your app. Some frameworks (Rails, Django, Next.js) default to localhost. Set the host to `0.0.0.0` explicitly.
- Port mismatch — your app listens on 3000, but `internal_port` is 8080. Pick one and make them match.

**Framework examples:**

Rails:

```
bin/rails server -b 0.0.0.0 -p 8080
```

Express / Fastify (Node.js):

```javascript
// Express
app.listen(8080, '0.0.0.0')

// Fastify
fastify.listen({ port: 8080, host: '0.0.0.0' })

```

Flask / Django (via Gunicorn):

```
gunicorn --bind 0.0.0.0:8080 myapp:app
```

Don't use Flask's or Django's built-in dev servers in production. Use Gunicorn or another WSGI server.

FastAPI (Uvicorn):

```
uvicorn main:app --host 0.0.0.0 --port 8080
```

---

## Health checks failing

Health checks tell the Fly proxy whether your Machine is ready to receive traffic. If a Machine fails its health checks, the proxy stops routing requests to it. If all your Machines fail health checks, your users get 503s. For the full picture on how health checks work, see [Health checks](/docs/reference/health-checks/).

### Out of memory or high CPU

If your app OOMs, the Machine crashes and health checks fail by definition.

```
fly machine status <machine-id>
```

Look for OOM kill events. Fix: add memory.

```
fly scale memory 512
```

For CPU-intensive apps, make sure you've selected an appropriate [Machine size](/docs/about/pricing/#machines). CPU and RAM scale together in preset combinations.

### Grace period

Your app needs time to start before health checks begin. Failed health checks are retried, but each failure adds backoff before the next attempt. If your app takes too long to become healthy, the deploy can fail.

Set a grace period to delay the first check:

```
[[services.tcp_checks]]
  grace_period = "10s"
```

For apps with slow startup (Rails, Django, large JVM apps), you may need 15-30 seconds. If you're not sure, start with `10s` and increase if deploys keep failing.

### Other health check failures

- **Blocked accept loop:** Your app's main thread is busy and can't accept new connections. Offload CPU work to background threads/workers.
- **Non-200 responses:** HTTP health checks expect a 200. If your health check endpoint returns redirects, auth challenges, or errors, the check fails. Use a dedicated `/healthz` endpoint that always returns 200.
- **App panics on startup:** Check `fly logs` for stack traces. Fix the crash. If it only happens on Fly (not locally), check your [secrets and env vars](#missing-secrets-or-environment-variables).

Define an explicit HTTP health check rather than relying on the implicit one:

```
[[services.http_checks]]
  grace_period = "10s"
  interval = "15s"
  method = "GET"
  path = "/healthz"
  timeout = "5s"
```

---

## Cold starts

After a deploy or when a stopped Machine wakes up, the first request is slow. This is expected — the Machine needs to boot and your app needs to initialize.

**Reduce cold start impact:**

- **Set a grace period** on your health check so the proxy waits for your app. See [Grace period](#grace-period).
- **Keep a Machine warm** with `min_machines_running = 1` in your `[http_service]` config. This ensures at least one machine is always running.
- **Use `stop` instead of `suspend`** if cold start latency matters more than wake-up speed. `suspend` is faster to resume but has [clock issues](#suspend-vs-stop).
- **Lighten your startup.** For heavy frameworks, defer non-essential initialization. Make your health check endpoint respond before the full app is ready.

If the first request after deploy always fails (not just slow), your grace period is probably too short. The proxy sends the request, your app isn't ready, and the request times out.

---

## Machine lifecycle issues

### Stuck Machines

Machines occasionally get stuck in a state (`replacing`, `starting`, `created`) and stop responding to commands.

Try these in order:

1. **Restart it:**
```
fly machine restart <machine-id>
```

1. **Force an update** (any metadata change can unstick the platform state)::
```
fly machine update <machine-id> --yes --metadata foo=bar
```

1. **Force destroy** (nuclear option — destroys the Machine):
```
fly machine destroy --force <machine-id>
```

After force-destroying, scale back up to replace it:

```
fly scale count <n>
```

### Machines stop immediately after starting

If your Machine starts and immediately stops, your app's process is exiting. The Machine has nothing to run, so it shuts down.

- Make sure your Dockerfile has an explicit `CMD`. Don't rely on the base image default.
- Test locally: `docker run <your-image>`. If it exits immediately in Docker, it'll exit immediately on Fly.
- Check `fly logs` for your app's exit code and any error output.

### Suspend vs stop

`stop` shuts down the VM. `suspend` snapshots memory to disk and resumes later — faster wake-up, but with a tradeoff.

**The clock problem:** When a Machine resumes from suspend, the system clock is wrong for a brief period. It thinks it's still the time when the Machine was suspended. This breaks:

- **JWT validation** — tokens appear to be issued in the future (`nbf` claim fails)
- **Cron jobs** — scheduled tasks fire at the wrong time
- **Cache TTLs** — expiration times are off
- **TLS certificate validation** — cert timestamps don't match

The clock corrects itself quickly, but if your app checks timestamps during the first moments after resume, things break.

**Fix:** If your app uses JWTs, time-sensitive scheduling, or certificate validation on startup, use `stop` instead of `suspend`:

```
[http_service]
  auto_stop_machines = "stop"
```

Or add clock-skew tolerance to your JWT validation (a few seconds of leeway).

---

## The init process

Fly injects a lightweight `init` process at runtime when your Machine starts. It doesn't modify your image — it runs in front of your app inside the VM.

This init handles:

- Reaping orphaned child processes (PID 1 responsibilities)
- Forwarding signals from the host to your app
- Setting up networking and volume mounts
- Coordinating clean shutdowns

**You don't need `tini`, `dumb-init`, or `s6-overlay` in your Dockerfile.** Fly's init covers these responsibilities. It's not a problem to keep them if they're already there — they'll just be redundant.

You can't disable or replace Fly's init. If you need setup scripts before your app starts, use a Docker `ENTRYPOINT` script that runs your setup and then execs your app.

---

## Networking and connectivity

### Custom domains and TLS

If your custom domain shows TLS errors, do an active check:

```
fly certs show <hostname>
```

You need either A **and** AAAA records, or a single CNAME record pointing to Fly (don't mix CNAME with A/AAAA)

**Using Cloudflare?** Most TLS issues on Fly involve domains behind Cloudflare. Read [Understanding Cloudflare](/docs/networking/understanding-cloudflare/) before debugging further. For all other setups, see [Custom domains](/docs/networking/custom-domain/).

### Flycast (internal load balancing)

[Flycast](/docs/networking/flycast/) routes traffic between your Fly apps over the private network. Two gotchas:

**force_https must be false.** Flycast is HTTP-only. Don't use `force_https`:

```
# Wrong for Flycast
[http_service]
  force_https = true

# Right for Flycast
[http_service]
  force_https = false
```

**Plain TCP services** need `[[services]]` with `protocol = "tcp"`, not `[http_service]`:

```
[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = []
    port = 4321
```

### Outbound connections

**Raw TCP over shared IPv4 doesn't work.** Fly's shared IPv4 addresses use the proxy, which needs SNI (from TLS) or a `Host` header (from HTTP) to route virtual host traffic. Non-HTTP, non-TLS TCP connections, such as unencrypted Redis, SMTP on port 25, or raw socket connections, fail on shared IPs because the proxy can't identify which app to route to.

Fixes:

- Allocate a dedicated IPv4: `fly ips allocate-v4`— gives your app its own IP, no virtual host routing needed
- Use `.internal` addresses for services on Fly's private network — these bypass the proxy entirely

**SMTP:** If you're having trouble with outbound email, we recommend using a transactional email service (like Postmark, Resend, or SendGrid) rather than sending directly from your Machines.

### CORS issues

If POST requests to your app return `403`, it's almost certainly your app's CORS middleware. The Fly proxy does not have a WAF and does not enforce CORS.

- Check that the `Origin` header your client sends is in your app's allowed origins list
- Make sure your app returns the correct `Access-Control-Allow-Origin`0 headers  on preflight (`OPTIONS`) responses
- If it works via `curl` but fails in the browser, that confirms it's a CORS issue in your app, not a Fly issue

---

## Database connections

### Managed Postgres

MPG clusters run on Fly's private network and aren't accessible over the public internet. Connection strings use `.flympg.net` domains, which resolve to private network addresses. See [Create and connect to MPG](/docs/mpg/create-and-connect/) for full details.

**To connect from your local machine::**

- Interactive psql: `fly mpg connect`
- Proxy to localhost: `fly mpg proxy` — forwards a local port to your database
- WireGuard: connect to your org's private network, then use the `.flympg.net` connection string directly. Read more in this [reference guide](/docs/blueprints/connect-private-network-wireguard/).

If `fly mpg proxy` times out, try `fly mpg connect` first to verify the cluster is healthy.

### Redis and Valkey

**IPv6 is required on Fly's private network.** Most Redis clients default to IPv4. If your connection fails with I/O errors:

```javascript
// ioredis — set family: 6
const redis = new Redis(process.env.REDIS_URL, {
  family: 6,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
```

For Upstash Redis on Fly, use the internal endpoint over IPv6, not the public TLS endpoint.

### Volumes and disk errors

If you see filesystem errors like `unable to read superblock`, your volume is corrupted. This is rare but can happen after a hard crash.

If you have snapshots enabled:

```
fly volumes list
fly volumes snapshots list <volume-id>
fly volumes create <name> --snapshot-id <snapshot-id> --region <region>
```

If you don't have snapshots, the data may be unrecoverable. **Always enable snapshots for volumes with data you care about.** See [Volume snapshots](/docs/volumes/snapshots/).

---

## Dashboard and account access

### Can't log in (GitHub SSO)

If GitHub SSO stops working and you can't access the dashboard:

- Try `fly auth logout` then `fly auth login` from the CLI
- If you need SSO removed from your account, email **billing@fly.io** — they verify ownership before making SSO changes

### Token issues

If you can't create or manage tokens:

```
fly tokens list
```

Token management bugs occasionally appear in specific flyctl versions. Update flyctl first. If `fly tokens create` fails, check the [community forum](https://community.fly.io/) for known issues with your version.

---

## Regional issues

Fly runs on bare metal in [17 regions](/docs/reference/regions/). Individual hosts or regions can have issues independent of the rest.

**Check status first:** [status.flyio.net](https://status.flyio.net)

If your app is down in one region but the status page is clear, the issue might be specific to your host. Run:

```
fly status
```

Check which region your Machines are in and whether they're healthy.

**Mitigation: deploy to multiple regions.** If all your Machines are in `iad` and `iad` has problems, your app is down. Spread across regions:

```
fly scale count 2 --region iad,ord
```

For databases, keep read replicas in a second region. For apps where latency matters, pick regions close to your users — `lhr` and `ams` for Western Europe, `nrt` and `sin` for Asia-Pacific.

If a region is down and you need to deploy urgently, scale into a healthy region:

```
fly scale count 1 --region ord
```

---

## Related topics

- [App configuration reference](/docs/reference/configuration/)
- [Fly Machines](/docs/machines/)
- [Networking on Fly.io](/docs/networking/)
- [Autostart and autostop](/docs/launch/autostop-autostart/)
- [Fly.io status page](https://status.flyio.net)