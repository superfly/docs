---
title: Scale VM Resources on an App
objective: 
layout: framework_docs
order: 50
---

[x] prerelease announcement


Scale memory and cpu with `fly machine update`:

```
fly machine update --memory 1024 21781973f03e89
fly machine update --cpus 2 21781973f03e89
```
