---
title: Launch a New App on Fly.io
objective: 
layout: framework_docs
order: 10
---

To create a brand new app on Fly.io, run `fly launch` from the root directory of your project. 

This command initializes a new App under your Organization and tries to configure it for deployment. 

## Language and Framework Scanners

`fly launch` scans your project's source code, and for many programming languages and frameworks it can get a whole project configured and deployed in a single step.

For other projects, you'll have to give flyctl more information to configure and build your project, before it can be deployed. Since Fly.io Apps run in VMs cooked up from Docker images, a big part of this is figuring out how to get or build this Docker image.

I’ll start an nginx app, and use that for the rest of the examples in this post.

```
fly launch --image nginx --internal-port 80
...
Created app dry-pond-1475 in organization tvd-testorg
Admin URL: https://fly.io/apps/dry-pond-1475
Hostname: dry-pond-1475.fly.dev
Wrote config file fly.toml
? Would you like to set up a Postgresql database now? No
? Would you like to set up an Upstash Redis database now? No
? Would you like to deploy now? Yes
? Will you use statics for this app (see https://fly.io/docs/reference/configuration/#the-statics-sections)? No
==> Building image
Searching for image 'nginx' remotely...
image found: img_wd57v5nge95v38o0
Provisioning ips for dry-pond-1475
  Dedicated ipv6: 2a09:8280:1::ce9b
  Shared ipv4: 66.241.124.2
  Add a dedicated ipv4 with: fly ips allocate-v4
No machines in dry-pond-1475 app, launching one new machine
  Machine 21781973f03e89 update finished: success
  Finished deploying
```
To try out Apps v2 use an app that does not require statics. Apps v2 doesn’t support statics, yet. We’ll announce when that changes.



Once `fly launch` finishes, use `fly open` to open the app’s homepage in a browser. The “Welcome to nginx!” page will show if everything worked.


* mention release commands, secrets, checks config references