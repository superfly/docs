---
title: Custom Deploy Workflows
layout: docs
nav: guides
author: kcmartin
date: 2025-12-05
---

## Overview

<div class="callout">
**This guide shows how to take control of your deployment flow, whether you're trying to avoid restarting machines, roll out changes gradually, or update specific parts of your app without touching others.**
</div>

Most people think of `fly deploy` as an all-or-nothing operation: you push a new image, and all your machines restart to run it. That behavior makes sense for many apps, but your app might need a more granular approach. Maybe you want to avoid interrupting machines processing long-running jobs (like video encoding or LLM chat sessions), or you want to gradually roll out changes to certain regions first.

The `fly deploy` command supports several flags for targeting specific machines by ID, region, or process group, giving you the control to tailor your rollout strategy to your app's needs.

## Why you might want this

These strategies are useful when you want to roll out code without disrupting active work. Maybe you're:

- Handling long-running tasks that shouldn't be interrupted mid-process
- Running workloads with unpredictable activity spikes where idle machines should be reused
- Trying to deploy more cautiously in production by segmenting your rollout
- Building your own logic to manage machine lifecycle instead of relying on a central deploy command

They're especially useful for apps that:

- Encode media, process jobs, or run background workers
- Exit cleanly after finishing a task
- Benefit from reusing stopped machines instead of spinning up new ones constantly

## Staggered and selective deploys

You don’t have to update your whole fleet all at once. Fly gives you several ways to target machines for more careful rollouts.

### By status: stopped machines

If your machines exit when they finish work, you can update only the stopped ones. This is useful for long-running tasks, background workers, or apps using `auto_stop_machines`.

```bash
# Build the new image and push it to the registry, but don't deploy it yet
fly deploy --build-only --push

# List all machines, filter for those in a "stopped" state, and save their IDs
fly machines list --json \
  | jq -r '.[] | select(.state == "stopped") | .id' \
  > stopped-machines.txt

# Deploy the new image only to the stopped machines
fly deploy --image THE_IMAGE \
  --only-machines $(cat stopped-machines.txt | paste -sd, -)
```

Repeat this process until all machines have rotated. This works best when:

- You're using `auto_stop_machines`
- Your app exits cleanly when done (`System.exit(0)` or equivalent)
- You want machines to manage their own lifetimes

### By region

To contain the blast radius or do a phased rollout, target machines by region:

```bash
# Deploy the current app image only to machines in the "dfw" region
fly deploy --regions dfw
```

Or combine with `--only-machines` to target specific IDs within a region:

```bash
# List all machines, filter for those in the "dfw" region, and save their IDs
fly machines list --json \
  | jq -r '.[] | select(.region == "dfw") | .id' \
  > dfw-machines.txt

# Deploy to just the first two machines from that list
head -n 2 dfw-machines.txt > batch-1.txt
fly deploy --image THE_IMAGE \
  --only-machines $(paste -sd, - < batch-1.txt)

# Deploy to the next three machines that weren't in batch 1
head -n 5 dfw-machines.txt | grep -vxFf batch-1.txt > batch-2.txt
fly deploy --image THE_IMAGE \
  --only-machines $(paste -sd, - < batch-2.txt)
```

Extend this rollout gradually by increasing the number of machines targeted in subsequent deploys. If you want to go further, you can script this logic to apply region by region, or even automate it based on health checks or metrics from your app.

### By process group

In multi-process apps, you might want to update only certain roles while leaving others untouched. For example, consider a cluster with `zk`, `supervisor`, and `conductor` process groups. If the `zk` machines need to stay up during an upgrade, you can deploy only to the other groups:

```bash
# Deploy the new image only to the "supervisor" and "conductor" process groups
fly deploy --image THE_IMAGE --process-groups supervisor,conductor
```

This allows the `zk` group to keep running on the previous image until you're ready to update them. This pattern is helpful for maintaining quorum or minimizing downtime in clustered environments.

## Handling partial rollout failures

Sometimes an image rolls out cleanly to some machines but fails on others. You should:

- Watch for startup errors or unhealthy states
- Retry failed updates individually
- Pause rollouts if failure rates climb

Eventually, you might want to implement an automated rollback based on health checks or deploy output. For now, just keeping track of which machines succeeded and which didn’t is a good start.

## CI integration

If you're using GitHub Actions or another CI, you can bake this deployment pattern in. For instance:

- `fly deploy --build-only --push` on main
- Update stopped machines using the image tag as part of a scheduled job
- Optionally notify Slack or GitHub comments when a full rollout completes

This lets you deploy continuously without interrupting running tasks.

## Dynamic config updates

Not every change needs a new image. For apps that load config from volumes or environment variables, you can:

- Update secrets or config maps with `fly secrets set`
- Restart idle machines to pick up the change
- Let active machines shut down naturally and restart with updated config

This is especially useful when your app supports live reloading or watches config files.

## Things to watch out for

### Forgetting to update all machines

If your script misses some stopped machines, or if others stop later, they might keep running an old image. Make sure your update loop is thorough and runs long enough to catch all of them.

### Long-lived machines never get updated

If your deployment strategy only updates stopped machines but your machines never exit on their own, they'll never upgrade. The most robust solution is to ensure you're using `auto_stop_machines` and that your app exits cleanly when it's done. If that’s not possible, you might configure your app to shut itself down after a fixed amount of time (a kind of time-to-live or TTL). Alternatively, use health checks to detect stale or idle machines, or forcibly stop them after a deadline using automation.

### Mixed-image behavior

When machines are on different image versions, your app needs to handle it. Schema changes, protocol mismatches, or config divergence can cause issues if you don’t plan for this.

### Hidden dependencies on deploy

Even if you're not restarting machines, some changes can still cause issues: environment variables, shared storage, or secrets might behave differently or get out of sync.

## Related reading

Want to go deeper on the ideas in this guide? Check out these Fly.io docs:

- [Machines overview](docs/machines/): Learn how Machines work and what makes them different.
- [fly deploy CLI reference](/docs/flyctl/deploy/): Full list of deploy options including `--only-machines`, `--regions`, and `--process-groups`.
- [Dynamic request routing](/docs/networking/dynamic-request-routing/): Use `fly-replay` to shift traffic between machines on the fly.
