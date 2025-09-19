---
title: Setting Hard and Soft Concurrency Limits on Fly.io
layout: docs
nav: firecracker
author: kcmartin
date: 2025-05-15
---

<figure>
  <img src="/static/images/setting-limits.png" alt="Illustration by Annie Ruygt of Frankie the hot air balloon with two other balloon friends of different colors" class="w-full max-w-lg mx-auto">
</figure>

## Introduction

On Fly.io, machines aren’t created automatically based on traffic; you create them manually. But once a machine is created, it can be stopped when idle (meaning you’re not paying for it), and started again instantly when load picks up. Our “autostart/autostop” feature can drive this process for you — but it only works well if you’ve tuned `soft_limit` and `hard_limit` correctly. Those limits tell Fly when a machine is too busy and it's time to bring more machines online.

## How to tune concurrency limits

Soft and hard limits for Fly Machines don’t have to be a black art. Here’s a quick rundown:

- **hard_limit**: max concurrent requests the machine will ever handle.
- **soft_limit**: how many it can handle _comfortably_, before Fly begins starting more machines. Incoming requests are distributed on a round-robin fashion to started machines.

The best way to dial this in is to actually test it. Based on the target app you’re working to scale, create a separate Fly app copy with the same machine config. Now set both limits absurdly high (say, 1000), and hammer it with load using something like `wrk`, `hey`, `ab`, `Locust`, or `k6`. Watch CPU, memory, and latency.

What you’re looking for is the point where responses start to slow down below your comfort threshold. That’s your hard limit—just below that threshold. Your comfort level is up to you; a real-time application will want to keep responses under 100ms, but an ordinary CRUD application might be just fine with request times around 250ms.

Now set your soft limit. The soft limit is there to give our proxy time to bring another machine online before your users notice lag. Example: if things start dragging at 20 concurrent requests, set `hard_limit`: 18 and `soft_limit`: 12.

Once you’ve got your limits dialed in, turning on `auto_start_machines` and `auto_stop_machines` gives you hands-off scaling behavior that still respects the boundaries you’ve set. Your app shouldn’t need babysitting to handle spikes, and you won’t end up running more machines than you meant to. It’s a good balance between elasticity and control.

### Capacity Planning: A Real Example

Let’s say:

- Each request takes ~100ms to serve.
- You’re expecting 750 requests per second.
- One machine handles about 10 concurrent requests before slowing down.

That means you need 75 concurrent request slots to keep up. So: 750 rps * 100ms = 75 concurrent requests. At 10 per machine, you’ll need 8 machines.

In order to serve requests as they arrive (that is, dispatch 750 requests/second) with an average processing time per request of 100ms, 75 “workers”, or concurrent requests handled, are needed. Based on the above machine capacity of 10 requests, 8 machines should be able to handle the proposed load.
