---
title: Load Balancing
layout: docs
nav: firecracker
---

[Fly Proxy](/docs/reference/fly-proxy) routes requests to individual Machines in your apps using a combination of concurrency settings specified on your app, current load, and closeness. This page describes the details of load balancing traffic to your apps on Fly.io.

## Load balancing strategy

The basic load balancing strategy is:

* Send traffic to the least loaded, closest Machine
* If multiple Machines have identical load and closeness, randomly choose one

### Load

Fly Proxy determines load using the [concurrency settings](/docs/reference/configuration#services-concurrency) configured for an app and the current traffic relative to those settings.

The table below describes how traffic may or may not be routed to a Machine based on configured `soft_limit` and `hard_limit` values.

| Machine load | What happens |
|---|---|
| Above `hard_limit` | No new traffic will be sent to the Machine |
| At or above `soft_limit`, below `hard_limit` | Traffic will only be sent to this Machine if all other Machines are also above their `soft_limit` |
| Below `soft_limit` | Traffic will be sent to the Machine when it is the closest Machine that is under `soft_limit` |

### Closeness

Closeness is determined by RTT (round-trip time) between the Fly.io edge server receiving a connection or request, and the worker server where your Machine runs. Even within the same region, we use different datacenters with different RTTs. These RTTs are measured constantly between all servers.

You can observe live RTT values between Fly.io regions using our [RTT app](https://rtt.fly.dev/).

## Example of load balancing for a web service

We have a hypothetical web service that we know can handle 25 concurrent requests with the configured CPU and memory settings. We set the following values in our fly.toml:

```toml
  [services.concurrency]
    type = "requests"
    hard_limit = 25
    soft_limit = 20
```

We set `type = "requests"` so Fly.io will use concurrent HTTP requests to determine when to adjust load. We prefer this to `type = "connections"`, because our web service does work for each request and our users may make multiple requests over a single connection (e.g., with HTTP/2). Fly Proxy will also pool connections to a Machine for a short time (about 4 seconds) when using `type = "requests"` to avoid frequent opening and closing of connections to your app.

We set the `soft_limit` to 20, so we have a little room for Fly Proxy to shift load to other Machines before a single Machine becomes overwhelmed.

We deploy 10 Machines in four regions: `ams` (Amsterdam), `bom` (Mumbai), `sea` (Seattle), and `sin` (Singapore), with three of those in `ams`.

In this contrived example, all of the users are currently in Amsterdam, so the traffic is arriving at one of the Fly.io edges in Amsterdam. Here's what happens as the number of concurrent HTTP requests from users in Amsterdam increases:

- 60 concurrent requests: Requests are divided evenly between the 3 Machines in the `ams` region. Closeness of the worker and edge will determine which of the 3 Machines each request goes to.
- 61+ concurrent requests: 60 of those requests will be sent to the 3 Machines in the `ams` region and the rest will be sent to the closest Machines in other regions.
- 200+ concurrent requests: All Machines are at their `soft_limit`, so Fly Proxy will start routing requests to the `ams` Machines again. For example, the 201st concurrent request will go to a Machine in the `ams` region that is currently at its `soft_limit`.
- 250 concurrent requests: All Machines are at their `hard_limit`. The 251st concurrent request will get queued by Fly Proxy until a Machine is below its `hard_limit`.

If traffic is far above the `hard_limit` for a long period of time, Fly Proxy might start returning 503 Service Unavailable responses for requests that are not able to be routed to a Machine.
