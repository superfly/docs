---
title: Load Balancing
layout: docs
sitemap: false
nav: firecracker
---

Fly.io routes requests to individual instances of your applications using a combination of concurrency settings specified on your application, current load, and closeness. This page describes the details of load balancing traffic to your applications on Fly.io.

## Load Balancing Strategy

Our load balancing strategy is:
* Send traffic to the least loaded, closest instance
* If multiple instances have identical load and closeness, randomly choose one


### Load

Load is determined by the [concurrency limits](/docs/reference/configuration#services-concurrency) configured for an application and the current traffic relative to those configured limits.

The table below describes how traffic may or may not be routed to an instance based on configured `soft_limit` and `hard_limit` values.

| Instance load | What happens |
|---|---|
| Above `hard_limit` | No new traffic will be sent to instance |
| At or above `soft_limit`, below `hard_limit` | Traffic will only be sent to this instance if all other instances are also above their `soft_limit` |
| Below `soft_limit` | Traffic will be sent to instance when it is closest instance that is under `soft_limit` |

### Closeness

Closeness is determined by RTT (round-trip time) between the Fly.io edge node receiving a connection or request, and the worker node where your instance runs. Even within the same region, we use different datacenters with different RTTs. These RTTs are measured constantly between all servers.

*Note:* These values are not visible to Fly.io users. We share this information here to help clarify how load balancing decisions are made.

## Examples

To help clarify how the Fly.io platform makes load balancing decisions, we provide some example configuration and scenarios:

### Web service

We have a web service that we know can handle 25 concurrent requests with the currently configured cpu and memory settings. So, we set the following the values in our fly.toml:

```toml
  [services.concurrency]
    type = "requests"
    hard_limit = 25
    soft_limit = 20
```

We set `type = "requests"` so Fly.io will use concurrent http requests to determine when to adjust load. We prefer this to `type = "connections"`, because our web service does work for each request and our users may make multiple requests over a single connection (e.g., with HTTP/2).

We choose to set our `soft_limit` to 20, so we have a little room for Fly.io to shift load to other instances before a single instance becomes overwhelmed.

We deployed 10 VMs in four regions: `ams`, `maa`, `sea`, and `sin`, with three of those in `ams`.

In this contrived example, all of the users are currently in Amsterdam (ams region) so their traffic is arriving at one of the Fly.io edges in Amsterdam. There are currently 3 instances of our web service running Amsterdam.

When users in Amsterdam generate up to 60 concurrent http requests, those requests are divided evenly between the three application instances in the ams region. Closeness of the worker and edge will determine which of the 3 instances each request goes to.

When users generate 61+ concurrent requests from Amsterdam, 60 of those requests will be sent to the 3 instances in the ams region and then the rest will be sent to instances in other regions based on which ones are closest.

That keeps going until we get to 200+ concurrent requests. At 200 concurrent requests all application instances are at their `soft_limit`, so Fly.io will start routing requests to the ams instances again. E.g., the 201st concurrent request will go to an application instance in the ams region that is currently at its `soft_limit`.

When users generate 250 concurrent requests, all instances will be at their `hard_limit`. The 251st concurrent request will get delayed by the Fly.io proxy until an instance is below its `hard_limit`.

If traffic is far above the `hard_limit` for a long period of time, Fly.io may start returning 503 Service Unavailable responses for requests that are not able to be routed to an instance.
