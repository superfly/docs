---
title: Cost Management on Fly.io
layout: docs
nav: firecracker
author: kcmartin
date: 2025-10-22
---

## Predicting your Fly.io bill and avoiding surprises

We’ve done our best to make billing on Fly.io something you can reason about. Machines don’t appear out of nowhere. If something is running, it’s because you launched it, or you configured something that did. In general, when we talk about **autoscaling**, we mean starting or stopping machines you’ve already defined. We don’t quietly spin up extras in the background that turn into mystery charges on your bill. The idea is that your bill should always be traceable to something you can see, name, and plausibly explain when someone asks. If it’s not, we’re happy to help you sort it out.

<div class="callout">
**Need more help understanding your bill?** Reach out to us at [billing@fly.io](mailto:billing@fly.io).
</div>

## A few examples

So when you’re budgeting, you can look at what you’ve provisioned and do some quick math. Let’s say you’ve deployed three “shared-1x 1GB” machines in `sjc`. That’s $20.37/month, tops. If you let them stop when idle, you might only pay for a few hours of compute—but the worst-case scenario is still capped at that monthly rate.

Here are a few more grounded examples:

- A **staging app** running in the  `sjc` region with one `shared-1x 256MB` machine that auto-stops when idle might cost less than **$1/month**. If you leave it running full-time, it’s still only **$2.32/month**.
- A **queue worker** (also in `sjc`) that uses metrics-based autoscaling on `shared-1x 512MB` machines might average 3–5 machines running during busy hours. If those stay up for 50% of the month, you’re looking at **$5.72–9.52/month**, worst-case around **$19 month** if they all run 24/7.

We recommend budgeting for the “always-on” cost. You can get under that number with auto-stop or bursty usage, but don’t depend on it to hit your budget.

If your estimate seems high, the most predictable way to save money isn’t fiddling with auto-stop/start settings (since any random request might spin a machine up again), but by just…running fewer machines. Or smaller ones.

<div class="callout">
**Want to play with numbers?** Try the [Fly.io pricing calculator](https://fly.io/calculator) to get a rough sense of what your setup might cost. For the full breakdown, here’s our [pricing page](/docs/about/pricing/).
</div>

## Metrics-based autoscaling can affect costs

There is one important exception to the rule that Fly.io doesn’t create machines on your behalf. If you use the **metrics-based autoscaler**, for example to scale a background worker based on queue depth, it _can_ create or destroy machines automatically.

**When can the metrics-based autoscaler create machines?** When you deploy and configure the [**Fly Autoscaler**](/docs/launch/autoscale-by-metric/), and use `FAS_CREATED_MACHINE_COUNT` instead of `FAS_STARTED_MACHINE_COUNT`, you're giving it permission to create and destroy machines on your behalf. It still uses the machine sizes and regions you specify, and anything it spins up counts toward your bill. [Read more in the docs](/docs/launch/autoscale-by-metric/).

## Other Stuff to Watch For

A few more things that can quietly run up your bill if you're not paying attention:

- **Bandwidth costs can add up.** Outbound data transfer is billed at $0.02/GB in North America and Europe, with higher rates in some other regions. Ingress is free. If you're serving media, syncing large datasets, or replicating across regions, bandwidth can quietly become a big line item. [Learn about data transfer pricing.](/docs/about/pricing/#data-transfer-pricing)
- **Volumes don’t stop billing when your machines do.** Persistent volumes are billed hourly, whether or not your machine is running. That 3GB volume you forgot about in `fra`? It's still costing you. [Read about storage pricing here](/docs/about/pricing/#volumes).
- **Volume snapshots will start billing in January 2026.** If you're using automatic volume snapshots as part of your backup strategy, just be aware: starting next year, they’ll be a billable feature. [We’ve announced the change](https://community.fly.io/t/we-are-going-to-start-charging-for-volume-snapshots-from-january-2026/26202) and will share more details well ahead of time.
- **Managed services live outside your apps.** Fly's [Managed Postgres](/docs/mpg/overview/) (MPG), [Upstash Redis](/docs/upstash/redis/), and [Tigris object storage](/docs/tigris/) don’t get deleted when you delete your apps. You’ll find them in  your Dashboard. If you're cleaning up, double-check there too. We've seen people get surprised by bills from leftover services and databases they thought were gone.
- **Dedicated public IPv4 addresses aren’t free.** Each http app gets billed $2/month if you assign it a dedicated public IPv4. If you’ve got a bunch of apps or deploy previews per branch, this can sneak up on you.
- **Internal-only apps still count.** Just because a Fly app doesn’t serve web traffic doesn’t mean it’s free. Background workers, queue processors, cron jobs: they all run machines, and those still cost money.

## Understanding Free Usage and Overages

- **Free allowances don’t cap your bill.** We may give you free credits and usage allowances, especially when you’re starting out or have a legacy billing plan. But there’s no soft ceiling. If you go over, we’ll bill you. We don't support billing alerts (yet), so budget accordingly.
- **There is no "free account/free tier" on Fly.io.** We do have a Free Trial program, which you can read about [here](/docs/about/free-trial/).
- **Check your dashboard often.** To spot ballooning costs and overages before they become an issue, check the "current month to date bill" item in your dashboard.

## Related Reading

Want to go deeper on scaling strategies, autoscaling configuration, or controlling concurrency? These docs walk through the mechanics:

- [Autoscale Fly Machines](/docs/blueprints/autoscale-machines/) A practical guide to getting basic autoscaling working with Fly Machines. Covers HTTP-based scaling triggers.
- [Setting Concurrency Limits](/docs/blueprints/setting-concurrency-limits/) Shows how to keep your app from getting overwhelmed by too many concurrent requests. Especially useful if you’re scaling horizontally.
- [Autoscale by Metric](/docs/launch/autoscale-by-metric/) This is the one that _can_ create machines automatically, based on queue depth, CPU, or concurrent connections. Use it wisely.
