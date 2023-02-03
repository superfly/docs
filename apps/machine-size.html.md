---
title: Scale Machine CPU and RAM
objective: 
layout: docs
nav: firecracker
order: 50
---

Scale memory and CPU with [`fly machine update`](/docs/flyctl/machine-update/).

There's a list of allowed CPU/RAM combinations and their prices on [our Pricing page](/docs/about/pricing/). Presets are available by name using the `--size` flag, and for each named preset, additional RAM settings are set through `fly machine update --memory`.

```
fly machine update --size shared-cpu-2x 21781973f03e89
fly machine update --memory 1024 21781973f03e89
fly machine update --cpus 2 21781973f03e89
```

If you try to set an incompatible CPU/RAM combination through `fly machine update --memory` or `fly machine update --cpus`, flyctl will let you know.

**For existing Nomad/V1 Fly Apps**: Existing apps whose VMs are managed by Nomad can still be scaled "vertically" using [`fly scale vm`](/docs/flyctl/scale-vm/) and [`fly scale memory`](/docs/flyctl/scale-memory/).