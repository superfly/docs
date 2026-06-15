---
title: Long-running tasks and machine lifecycle
layout: docs
nav: guides
author: kcmartin
date: 2026-06-15
---

This page covers what happens when your machine is busy doing work, but Fly thinks it's idle. Specifically: how `auto_stop_machines` decides what to stop, why a background task is invisible to that decision, and the two patterns that keep work from getting killed.

If you're picking a queue technology or a cron runner, start with the [work queues](/docs/blueprints/work-queues/) or [task scheduling](/docs/blueprints/task-scheduling/) blueprints instead. This page is about the machine behavior underneath them.

## The problem

A typical setup: a FastAPI endpoint accepts a request, spawns an async task to generate a report, returns `202 Accepted`, and closes the connection. The proxy sees no active connections. A few minutes later, it stops the machine. The report dies half-finished.

This isn't a bug. It's `auto_stop_machines` working exactly as documented. The proxy looks at inbound traffic. It does not look inside the container. From the proxy's point of view, a machine running a 20-minute job and a machine doing nothing look identical.

There are two ways to fix it. Pick one based on whether your work is bursty or steady, request-triggered or queue-driven.

## How autostop actually decides

The Fly proxy evaluates machines every few minutes. The exact rule depends on how many machines you have:

**Multiple machines.** The proxy uses your `soft_limit` concurrency setting to compute excess capacity:

```
excess = num_machines − (num_machines_over_soft_limit + 1)
```

If `excess ≥ 1`, the proxy stops one machine. The `+ 1` keeps a buffer of one idle machine for incoming traffic.

**Single machine.** Simpler: if load is zero, the proxy stops the machine.

In both cases, "load" means traffic the proxy can see. Background work running inside the machine, whether that's async workers, cron-style loops, or anything else not driven by an inbound request, doesn't count. There's also no way for your application to tell the proxy, "I'm busy, leave me alone."

This is the central fact for the rest of the page. Everything below is a way to work around it.

### Stop vs. suspend

`auto_stop_machines` takes three values: `"off"`, `"stop"`, and `"suspend"`.

- **stop** shuts the machine down cold. A restart takes seconds (about 2s for a Rails app, less for a small binary).
- **suspend** dumps the entire VM state (memory, CPU, network) to disk. Resume takes a few hundred milliseconds.

**Stop** is the simpler default: the machine shuts down when it's idle and cold-starts when it's needed again. For most apps, that's the right tradeoff.

**Suspend** is the right choice when cold start is too painful (slow framework boot, heavy initialization, large in-memory state) and you'd still like to idle when inactive. The tradeoff: suspend is rougher on the underlying platform and has more constraints:

- Machines must have 4 GB of RAM or less.
- Swap and schedules are not supported.
- Machines updated before June 20, 2024 cannot be suspended.
- Suspend is not durable. Fly does not guarantee that a suspended machine will resume. Host migration, maintenance, or capacity pressure can turn what would have been a resume into a cold start. Treat suspend as a faster version of stop, not a guaranteed warm restart.
- A few log lines may be lost across a suspend/resume cycle, and the system clock can take a second or two to re-synchronize after resume. See "[Suspend vs. Stop](/docs/getting-started/troubleshooting/#suspend-vs-stop)" for details on clock skew.

Billing is the same for both: you pay for stopped machines like you pay for suspended ones.

For the rest of this page, "stop" and "suspend" are interchangeable. The patterns work the same way for both.

## Pattern A: disable autostop, manage shutdown in the app

**Use this when** your app has long-lived workers, in-process job runners, or any background work that the application itself can track.

Turn autostop off in `fly.toml`:

```toml
[http_service]
  internal_port = 8080
  auto_stop_machines = "off"
  auto_start_machines = true
```

With autostop off, the proxy never stops your machines for being idle. They stay up until something else stops them (a deploy, `fly machine stop`, or a host migration). You're paying for every machine 24/7, in every region you've scaled into, so make sure that's the right tradeoff before adopting this pattern.

When deploys, manual stops, or host migrations _do_ stop the machine, your app gets `SIGTERM` and has `kill_timeout` seconds to clean up. The default of 5 seconds is almost certainly too short. Bump it. These are top-level keys in `fly.toml`:

```toml
kill_signal = "SIGTERM"
kill_timeout = "30s"
```

The maximum is 300 seconds. `kill_timeout` is a drain window, not a "let the job finish" knob. If your jobs run longer than 5 minutes, either checkpoint them so they can resume, or stop accepting new work and let in-flight jobs drain before the timeout. Don't wait for everything to finish.

A minimal shutdown pattern in Node:

```javascript
let activeJobs = 0
let shuttingDown = false

async function runJob(payload) {
  if (shuttingDown) throw new Error("shutting down")
  activeJobs++
  try {
    await doWork(payload)
  } finally {
    activeJobs--
  }
}

process.on("SIGTERM", () => {
  shuttingDown = true
  const start = Date.now()
  const deadline = 25_000 // 5s under kill_timeout
  const tick = setInterval(() => {
    if (activeJobs === 0 || Date.now() - start > deadline) {
      clearInterval(tick)
      process.exit(0)
    }
  }, 200)
})
```

In Python with asyncio:

```python
import asyncio, signal

active = 0
shutting_down = asyncio.Event()

async def run_job(payload):
    global active
    if shutting_down.is_set():
        raise RuntimeError("shutting down")
    active += 1
    try:
        await do_work(payload)
    finally:
        active -= 1

async def shutdown():
    shutting_down.set()
    try:
        await asyncio.wait_for(_drain(), timeout=25)
    except asyncio.TimeoutError:
        pass

async def _drain():
    while active > 0:
        await asyncio.sleep(0.2)

loop = asyncio.get_event_loop()
loop.add_signal_handler(signal.SIGTERM, lambda: asyncio.create_task(shutdown()))
```

Both patterns refuse new work as soon as `SIGTERM` arrives, then wait for in-flight jobs up to a deadline a few seconds shorter than `kill_timeout`. The safety margin matters, if you wait the full 30s, Fly's `SIGKILL` arrives before your `exit(0)` runs.

## Pattern B: split web and worker into separate process groups

**Use this when** web traffic is bursty (good candidate for autostop) but background work is steady or long-running (bad candidate for autostop).

Split with `processes` in `fly.toml`:

```toml
[processes]
  web = "bundle exec puma"
  worker = "bundle exec sidekiq"

[http_service]
  internal_port = 8080
  auto_stop_machines = "suspend"
  auto_start_machines = true
  processes = ["web"]
```

The worker process group has no `[http_service]` attached, so the proxy never touches its machines. Autostop applies only to the web tier.

Scale them independently:

```cmd
fly scale count web=2 worker=1
```

This is the pattern Sidekiq, Celery, and BullMQ workers actually want. The web tier scales to zero off-hours; the worker tier runs whenever there's work in the queue.

Tradeoff: you're paying for at least one worker machine continuously. If your work is batchy enough that on-demand workers make sense, use the [work queues blueprint's on-demand worker pattern](/docs/blueprints/work-queues/) instead, as that spins up a fresh machine per job and lets it stop when done.

## Graceful shutdown: what Fly sends

When something stops your machine, whether that's `auto_stop_machines`, `fly machine stop`, a deploy, or a host migration, Fly sends `kill_signal` (default: `SIGTERM`) to PID 1. After waiting `kill_timeout` seconds, it sends `SIGKILL`.

The defaults are conservative:

| Option | Default | Max | Notes |
| --- | --- | --- | --- |
| `kill_signal` | `SIGTERM` | — | Also accepts `SIGQUIT`, `SIGUSR1`, `SIGUSR2`, `SIGKILL`, `SIGSTOP` |
| `kill_timeout` | `5s` | `300s` | The drain window before `SIGKILL` |

Five seconds is enough for an HTTP server to close keepalives. It is not enough for a long-running job to finish. If you have any background work, set `kill_timeout` to a value that allows your typical job to complete. You'll need to determine this on your side. Both keys are top-level in `fly.toml`:

```toml
kill_signal = "SIGTERM"
kill_timeout = "30s"
```

PID 1 receives the signal. In a Docker container running your app directly, that's your process. In a container running a shell wrapper (`CMD ["sh", "-c", "..."]`), the shell is PID 1 and `SIGTERM` doesn't propagate. Use the exec form: `CMD ["myapp"]`, or `exec myapp` inside the wrapper.

`kill_timeout` is not a "finish your work" timer. It's a drain window. Inside it, you should:

1. Stop accepting new work
1. Let in-flight work finish, or checkpoint it
1. Exit cleanly

If your jobs take longer than 5 minutes, you can't drain them inside `kill_timeout`. You need either Pattern A with checkpoint/resume, or Pattern B with a worker tier that's never autostopped.

Run `fly config validate --strict` before relying on any of this. By default, `fly config validate` silently accepts unrecognized sections and keys. A typo or outdated section name can pass validation and then do nothing at runtime. Strict mode catches those errors.

## Picking a pattern

| Situation | Pattern |
| --- | --- |
| Jobs are short (< 30 seconds) | Increase `kill_timeout`; everything else can stay as default |
| Long-running jobs, steady web traffic | A — disable autostop, in-app drain |
| Long-running jobs, bursty web traffic | B — split web/worker processes |
| Cron-style scheduled jobs | See [task scheduling](/docs/blueprints/task-scheduling/) |
| Queue-driven workers | B — combine with [work queues](/docs/blueprints/work-queues/) |
| One-off jobs (fire and forget per request) | On-demand workers — see [work queues](/docs/blueprints/work-queues/) |
| Can't restructure right now | A — accept the continuous machine cost |

## Common problems

**My `SIGTERM` handler runs but the job still gets killed.** `kill_timeout` is shorter than your handler needs. Bump it (max 300s) and set your handler's deadline a few seconds under that.

**The machine stops mid-job even with `auto_stop_machines = "off"`.** Autostop is only one of several things that stop machines. Deploys, `fly machine stop`, scale-down, and host migrations all do too. Check `fly logs` for the `instance refused` or `host migration` events. Pattern A still applies. The only difference is that autostop is no longer the trigger.

**Why doesn't a self-ping keep my machine alive?** It won't. The [autostop reference](/docs/reference/fly-proxy-autostop-autostart/) defines idle as "a load of 0" but doesn't specify what counts as load. Empirically, sending a successful HTTP request every 60 seconds from a machine to its own `<app>.fly.dev` hostname does not prevent autostop. The proxy still stops the machine after 5 to 10 minutes. To keep a machine running through idle traffic, turn off autostop (Pattern A) or move the work into a process group without `[http_service]` (Pattern B).

**Worker machines won't stop when I deploy.** A process group with no `[http_service]`, such as the worker tier in Pattern B, is invisible to the proxy. Deploys still update those machines because `flyctl` talks to them directly, but the proxy does not manage their lifecycle and cannot autostop them. To stop them gracefully, send a signal with `fly machine stop` or let `fly deploy` replace them during a deployment.

**Suspend resumes are slower than the docs say.** Suspend isn't durable. If Fly can't restore the snapshot (host migration, capacity pressure), you get a cold start. There's no flag to tell you which happened; check the first-request latency. If cold starts matter, run with `min_machines_running = 1`.

## Where to go next

- [Work queues blueprint](/docs/blueprints/work-queues/): Picking a queue technology
- [Task scheduling blueprint](/docs/blueprints/task-scheduling/): cron-style triggers and scheduled machines
- [Autostart and autostop reference](/docs/reference/fly-proxy-autostop-autostart/): The proxy's full decision logic
- [Configuration reference](/docs/reference/configuration/): `kill_signal`, `kill_timeout`, `processes`, `auto_stop_machines`
- [Machine states](/docs/machines/machine-states/):  what `stopping`, `stopped`, and `suspended` actually mean
