---
title: "Cross-App Routing"
layout: docs
sitemap: false
nav: firecracker
---

Between [Fly Machines](/docs/reference/machines/) and our Rust proxy (aptly named fly-proxy), we've build a cohesive set of features for building your own cloud.

Here's an example: cross-app routing. If you've built a cloud service, you need a way to route incoming requests to the VM that corresponds to that customer or that workload.

Here's one way to do this on Fly, without building your own proxy (building proxies sucks): Create an app per customer, and send all traffic to a "router" app that knows where all your users' requests should go. 

The router app replies with a [`fly-replay`](/docs/reference/fly-replay) header; for example, `fly-replay: app=other-app-name-in-the-same-org`. Our Rust proxy will route the original request to the nearest instance of your customer app. 

![Diagram showing a user request ](/docs/images/fly-replay-machines.png)

You can specify a region, too: `region=sjc,app=other-app-name-in-the-same-org`.

See [the`fly-replay` docs](/docs/reference/fly-replay) for other routing magic `fly-replay` and fly-proxy can do together.

If the request hits a Machines VM that's in a stopped state, fly-proxy will try to wake it up. You can even create Machines on-the-fly if that makes sense for you.
 

---

(This makes machines more powerful.

Even better, this will work with machines/apps on isolated networks. We haven’t really exposed this yet, but apps can live on entirely separate networks within an organization.)
