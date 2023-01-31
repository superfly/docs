---
title: Scale Machine CPU and RAM
objective: 
layout: docs
nav: firecracker
order: 50
---

Scale memory and CPU with `fly machine update`:

```
fly machine update --memory 1024 21781973f03e89
fly machine update --cpus 2 21781973f03e89
fly machine update --size 
```

There's a list of valid CPU/RAM combinations and their prices on [our Pricing page](/docs/about/pricing/). Presets are available by name using the `--size` flag, and for each named preset there's a range of additional RAM you can add using `fly machine update --memory`.


**For existing Nomad/V1 Fly Apps**: Existing apps whose VMs are managed by Nomad can still be scaled "vertically" using [`fly scale vm`](/docs/flyctl/scale-vm/) and [`fly scale memory`](/docs/flyctl/scale-memory/).