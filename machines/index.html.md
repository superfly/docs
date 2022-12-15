---
title: "Fly Machines"
layout: framework_docs_overview
toc: false
redirect_from: /docs/reference/machines/
---

Fly Machines are [Firecracker VMs](https://firecracker-microvm.github.io/) with a fast REST API that can boot instances in about 300ms, in any region supported by [Fly.io](https://fly.io/docs/reference/regions/).

The [Machines API](/docs/machines/working-with-machines/) gives you efficient, low-level control over VM provisioning, supported by Fly.io infrastructure and networking features.

Machines are also the spawning ground for new platform features like *wake-on-request* (also known as *scale-to-zero*). You can
stop a running machine to save on compute costs. It then may be started automatically when a request arrives at the Fly proxy.

[Read the Fly Machines announcement post.](https://fly.io/blog/fly-machines/)

## TL;DR Machine Features

1. They can be managed by API
1. They turn off automatically when a program exits
1. They can be started very quickly
1. Restarted machines are a blank slate - they are ephemeral
1. They can be started manually, but can also wake on network access
1. You can run multiple machines within an application
