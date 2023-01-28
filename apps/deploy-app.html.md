---
title: Deploy Changes to an App
objective: 
layout: appsv2
order: 30
---

[x] prerelease announcement


`fly deploy` continues to work to update the app:

```
fly deploy
==> Building image
Searching for image 'nginx' remotely...
image found: img_wd57v5nge95v38o0
Deploying dry-pond-1475 app with rolling strategy
  Machine 21781973f03e89 update finished: success
  Finished deploying
```

release_command, rolling and immediate strategies, and the other deploy flags and settings are supported. There are some small variations in apps v2, and we’ve limited them as much as possible and updated flyctl to tell you about them.
