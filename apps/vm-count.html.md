---
title: Scale VM Count on an App
objective: 
layout: appsv2
order: 60
---

[x] prerelease announcement

Scaling an app is different with Apps v2. Use `fly machine clone` to horizontally scale the app, even across regions:

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
