---
title: Machine Placement and Regional Capacity
layout: docs
nav: machines
author: kcmartin
date: 2025-06-20
---

<div class="callout">
**When you scale an app on Fly.io, where your machines land depends on regional capacity. Here's how to keep that from surprising you.**
</div>

Let’s say you run `fly scale count` and tell it to drop 10 machines into `dfw` and 10 more into `iad`. If either of those regions is out of capacity, _the entire scale operation fails_. Nothing gets placed. It’s all or nothing.

Most of the time this just works—`dfw` and `iad` are solid bets for region choices. But some regions, like `sjc`, `gru`, and `bom`, tend to be in high demand. If you hardcode your placement into one of those and cross your fingers, you might find yourself scaling to zero.

### How to check available capacity

Run `fly platform regions`. You’ll get a list of regions and their available CPU cores. These aren’t guarantees, but they’re a decent snapshot of where you’re most likely to succeed.

### Let the scheduler help

For individual machine operations like `fly machine clone` or creating a new machine, you can give the scheduler some leeway. Instead of pinning a single region, you hand it a prioritized list or a geographic group. It tries each in order until it finds one that works.

For example:

```
fly machine clone -r "iad,dfw"
```

That says: try `iad`, then fall back to `dfw`.

### Geographic groups and aliases

You can use geographic aliases like `us`, `eu`, or `sa` to fan out across a broader area.

| Alias | Area|
|---------|------------------------|
| `apac` | Asia-Pacific |
| `eu` | Europe |
| `na` | North America |
| `sa` | South America |
| `us`, `usa` | United States |


### Examples:

- Try London first, then fall back to anywhere in Europe:

```
lhr,eu
```

- Try any US region first, then Europe:

```
us,eu
```

- Try any North American region first, then any South American region:

```
na,sa
```


### Scale commands don't (yet) do this

Right now, flexible placement doesn’t apply to `scale`, `deploy`, or `launch`. If you want to scale across regions with fallbacks, the supported way to do that is by cloning machines individually (or using `fly machine create`), with region preferences.

(We know that’s a bit clunky. We’re working on it.)

### Machines API support

If you're driving placement from the Machines API (`api.machines.dev`), all of this flexibility is available there: prioritized region lists, meta-regions, and `any` placement.

### A word on architecture

This only helps if your app actually works when deployed across multiple regions. That means not assuming low-latency connections between machines, and avoiding coordination patterns that only work in single-region setups.

<div class="callout">
Want to see where your app might run? 
Here's the [current list](/docs/reference/regions/): ams, arn, bom, cdg, dfw, ewr, fra, gru, iad, jnb, lax, lhr, nrt, ord, sin, sjc, syd, yyz.
</div>


### Related reading:

- [An Introduction to Fly Machines](/docs/machines/overview/)
- [Regions Reference](/docs/reference/regions/)
- [Fly Machines API](/docs/machines/api/)
- [Get Regions](https://docs.machines.dev/#tag/platform/get/platform/regions)
