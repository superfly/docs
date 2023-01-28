---
title: Run Multiple Processes in an App
objective: 
layout: docs
nav: firecracker
order: 90
---


[Processes](https://fly.io/docs/reference/configuration/#the-processes-section) continue to be supported in fly.toml. The big difference with apps v2 is you need to specify which machines are assigned to which processes.

`fly deploy` will update each machine based on its process group, applying only the services, cmd, and checks for that process.

Use `fly machine update` to assign a process group to a machine with:

```
fly machine update --metadata fly_process_group=app 21781973f03e89
fly machine update --metadata fly_process_group=app 9e784925ad9683
fly machine update --metadata fly_process_group=worker 148ed21a031189
fly deploy
==> Building image
Searching for image 'nginx' remotely...
image found: img_wd57v5nge95v38o0
Deploying dry-pond-1475 app with rolling strategy
  Machine 21781973f03e89 [app] update finished: success
  Machine 148ed21a031189 [worker] update finished: success
  Machine 9e784925ad9683 [app] update finished: success
  Finished deploying
```

Make sure to run `fly deploy` after updating these groups to ensure each machine gets the appropriate services, checks, and cmd. These are the key pieces of the fly.toml that configure the processes, with the one service using the `"app"` process group:

```
[processes]
  app = "nginx -g 'daemon off;'"
  worker = "tail -F /dev/null" # not a very useful worker!

[[services]]
  processes = ["app"]
```

`fly machine clone` can then be used to build out multiple instances within a process group, or to clone a machine and put it in a different process group:

```
fly machine clone --region gru 21781973f03e89
fly machine clone --process-group worker 21781973f03e89
```
