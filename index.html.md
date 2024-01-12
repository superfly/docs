---
title: "Fly.io developer documentation"
layout: docs
sitemap: false
nav: firecracker
---

Deploy your project in a few minutes with [Fly Launch](/docs/apps/). Then do more with [Fly Machines](/docs/machines/).

## Run your entire stack near your users

Deploy in any [region](/docs/reference/regions/). Manage your worker [processes](/docs/apps/processes/) alongside your web server. Back it with a [Fly Postgres](/docs/postgres/) app, or bring your own exotic database. Whatever supporting infrastructure you need! It's all just VMs.

[Try our Speedrun](/docs/speedrun/)

[Learn more about Fly Launch](/docs/apps/)

## Scale at your own pace

[flyctl](/docs/flyctl/) helps you herd VMs, but puts the power in your hands.

Scale locally, or put your app next to your users in ten more cities. Either way, it's [one command](/docs/apps/scale-count/). Add CPU oomph or RAM, again with [one command](/docs/apps/scale-machine/). Pay for what you use, and have your VMs stop when they're idle, so you don't use more than you need.

<figure>
  <img src="/static/images/docs-intro.webp" srcset="/static/images/docs-intro@2x.webp 2x" alt="">
</figure>

## Control individual VMs

The Fly Launch platform-as-a-service is there to make your apps easy to launch and manage. When you outgrow its opinions, micromanage your app VMs with `fly machines` commands, or drop down a level of abstraction to the [Machines](/docs/machines/working-with-machines/) API. Launch [tiny, fast-booting VMs](/docs/machines/) from your app! The perfect way to run user code, or try that sketchy TypeScript snippet ChatGPT suggested.

[Learn more about Fly Machines](/docs/machines/)

## Build your own cloud

Go ahead and build your own cloud on top of Fly Machines! Did we mention it's all just VMs? Fly.io features don't care what shape your project takes. A powerful CLI, remote Docker builds, private networking, persistent storage, logging, metrics, secrets management, load balancing, certs, autoscaling, dynamic request routing...it's all available, whatever scale and complexity you're working with.