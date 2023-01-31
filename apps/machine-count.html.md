---
title: Scale the Number of Machines
objective: 
layout: docs
nav: firecracker
order: 60
---

Use `fly machine clone` to add a Machine that will be managed by `fly deploy`. The new Machine will be, as you would expect, a copy of the specified Machine. If the original Machine has a volume attached, a blank volume will be provisioned for the new Machine. It's up to you to decide what to put on the new volume: Fly.io will not automatically copy the contents of the original Machine's volume.

```
fly machine clone 21781973f03e89
fly machine clone --region syd 21781973f03e89
fly machine clone --region ams 21781973f03e89
```

After running the above commands, there would be four Machines running for this app: the original Machine plus three new ones. Use `fly machine stop` and `fly machine destroy` to scale down the app:

```cmd
$ fly machine stop 9080524f610e87
```
```cmd
$ fly machine destroy 9080524f610e87
```

If a Machine is misbehaving (for instance, it's not `stop`ping successfully), you can try `fly machine destroy --force` to get rid of it.

```cmd
fly machine destroy --force 0e286039f42e86
```

**For existing Nomad/V1 Fly Apps**: Existing apps whose VMs are managed by Nomad can still be scaled "horizontally" using [`fly scale count`](/docs/flyctl/scale-count/).