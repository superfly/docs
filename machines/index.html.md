---
title: "Fly Machines"
layout: framework_docs_overview
toc: false
redirect_from: /docs/reference/machines/
---

Fly Machines are [Firecracker VMs](https://firecracker-microvm.github.io/) with a fast REST API that can boot instances in about 300ms, in any region supported by [Fly.io](https://fly.io/docs/reference/regions/).

The Machines API gives you efficient, low-level control over VM provisioning, supported by Fly.io infrastructure and networking features.

Machines are also the spawning ground for new platform features like *wake-on-request* (also known as *scale-to-zero*). You can
stop a running machine to save on compute costs. It then may be started automatically when a request arrives at the Fly proxy.

[Read the Fly Machines announcement post.](https://fly.io/blog/fly-machines/)