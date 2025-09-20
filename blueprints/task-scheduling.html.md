---
title: Task scheduling guide with Cron Manager and friends
layout: docs
nav: firecracker
author: kcmartin
categories:
  - cron
date: 2025-07-18
---

<figure>
  <img src="/static/images/task-scheuling.png" alt="Illustration by Annie Ruygt of Frankie the hot air balloon scheduling some tasks on his calendar" class="w-full max-w-lg mx-auto">
</figure>

Running on a schedule: it's not just for trains. If your app needs to rebuild a cache every night, prune old data, or email a weekly newsletter to your users, you’re probably looking for a way to run a cron job. Fly.io gives you a few ways to get that done.

We’ll walk through options for task scheduling, starting with the most robust and ending with the “it works, okay?” tier.

## Cron Manager

[Cron Manager](https://github.com/fly-apps/cron-manager) is our “batteries-included” solution for running scheduled jobs. It’s a small Fly app that spins up temporary Machines—one per job—and tears them down afterward. Think of it as a very polite butler that rings a bell and quietly disappears before you remember you don’t have a butler.

### How It Works

You deploy Cron Manager as its own Fly app. It stays online, watching a `schedules.json` file. When a job’s scheduled time hits, it boots a one-off Machine with whatever image, region, and resources you specify. That Machine runs the command, exits, and disappears like a good container should.

Jobs run in complete isolation—no shared environment, no weird state carried over from the last job. And because they’re just Fly Machines, you get all the perks: region placement, resource control, image selection, and clean logs.

### Why Use This

- **Isolation**: Each job gets its own Machine. Nothing leaks.
- **Central config**: `schedules.json` lives in Git. Changes are versioned, auditable, and deployable.
- **Easy updates**: Want to change a command or schedule? Update the file and redeploy.
- **Job logs**: Each Machine has its own logs and lifecycle. Debugging isn’t a treasure hunt.

### Setup

1. Clone [cron-manager](https://github.com/fly-apps/cron-manager)
1. Create a new Fly app and deploy it with `fly deploy`
1. Set your `FLY_API_TOKEN` as a secret for the app
1. Define your job schedules in `schedules.json`

Here’s a sample job:

```json
{
  "name": "daily-cache-rebuild",
  "app_name": "my-app",
  "schedule": "0 3 * * *",
  "region": "lhr",
  "command": ["bin/rebuild-cache"],
  "command_timeout": 300,
  "enabled": true,
  "config": {
    "image": "my-app-image",
    "guest": { "cpu_kind": "shared", "cpus": 1, "memory_mb": 256 },
    "restart": { "policy": "no" }
  }
}
```

### Managing Jobs

Once deployed, you can:

- List jobs: `cm schedules list`
- Check history: `cm jobs list <schedule-id>`
- Peek at details: `cm jobs show <job-id>`
- Trigger one manually: `cm jobs trigger <schedule-id>`

SSH into the Cron Manager VM if you need to do some spelunking.

---

## Supercronic

Sometimes you don’t need a full orchestration layer—you just want a crontab to run inside your app container. Supercronic does that. It’s a container-friendly cron runner that handles environment variables correctly.

### How It Works

[Supercronic](/docs/blueprints/supercronic/) runs as a background process inside your app. You add a `crontab` file, install Supercronic in your Dockerfile, and define a `cron` process in `fly.toml`. Done.

Well, almost done—remember to scale it correctly.

### Setup

1. Add a crontab file (`/app/crontab`) using standard syntax
1. Install Supercronic in your Dockerfile
1. In `fly.toml`:

```
[processes]
app = "bin/server"
cron = "supercronic /app/crontab"
```

1. Scale it:

```bash
fly scale count app=2 cron=1
```

Only run one copy of the cron process. Unless your goal is to send four copies of the same reminder email. (In which case, carry on.)

---

## Scheduled Machines

Fly Machines support basic scheduling out of the box: you can tell a Machine to start hourly, daily, weekly, or monthly. The API is simple. The downside? You don’t get fine-grained control—just interval buckets.

This is fine for non-critical cleanup tasks or anything where “roughly once a day” is good enough.

---

## In-App Scheduling

If you’re already using a scheduler like `apscheduler` in a Python app—or you’ve duct-taped one together in Node—you can use it to call `fly machine run --rm` and spin up ephemeral Machines manually.

This gives you full control and is technically elegant, though it does require some careful footwork. It’s the “build your own trigger system” option, best for when you’re already halfway there.

---

## Additional Options

In addition to the options above, you can use an external scheduling service, like [GitHub Actions schedule](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#schedule), or [easycron](https://www.easycron.com/), an online cron service which can send out API requests to wake machines up.

---

## Summary

| Option | Use When… | Good To Know |
| --- | --- | --- |
| **Cron Manager** | You want isolated, auditable job runs | Requires a separate app |
| **Supercronic** | You want quick cron jobs inside your container | Keep the process count to one |
| **Scheduled Machines** | You want simple, low-frequency jobs (~1x/day) | Not for precise timing |
| **In-App Scheduler** | You want full control and don't mind plumbing | Write your own orchestration |

---

If you're not sure where to start, Cron Manager is the most production-hardened option. But Supercronic gets you 80% of the way with almost no setup, and sometimes that’s all you need.



## Related Reading

- [Cron Manager](https://github.com/fly-apps/cron-manager)
- [Crontab with Supercronic](/docs/blueprints/supercronic/)
- [Deferring long-running tasks to a work queue](/docs/blueprints/work-queues/)

