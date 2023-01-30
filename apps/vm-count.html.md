---
title: Scale VM Count on an App
objective: 
layout: docs
nav: firecracker
order: 60
---

Use `fly machine clone` to add a Machine that will be managed by `fly deploy`. The new Machine will be, as you would expect, a copy of the specified Machine. If the original Machine has a volume attached, a blank volume will be provisioned for the new Machine. It's up to you to decide what to put on the new volume; Fly.io will not automatically copy the contents of the original Machine's volume.

```
fly machine clone 21781973f03e89
fly machine clone --region syd 21781973f03e89
fly machine clone --region ams 21781973f03e89
```

Now 4 machines are running for this app: the original machine plus three new ones. Use `fly machine stop` and `fly machine remove` to scale down the app:

```
fly machine stop 9080524f610e87
fly machine remove 9080524f610e87
fly machine remove --force 0e286039f42e86
```
