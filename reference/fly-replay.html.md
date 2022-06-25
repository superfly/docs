---
title: The Fly-Replay Header
layout: docs
sitemap: false
nav: firecracker
---

With the `fly-replay` response header, an instance of an app can respond to an HTTP request by asking the Fly proxy to deliver (replay) it somewhere else within the same Fly organization. The content of the `fly-replay` header fields tells our proxy which magic to perform.

|Field |Purpose |
|---|---|
|`region` | The 3-letter code for a region to which the request should be routed. |
|`instance` | The ID of a specific instance to which the request should be routed. |
|`app` | The name of an app within the same organization, to which the request should be routed.<br>fly-proxy will choose the nearest instance.|
|`state` | Optional payload to include in a `fly-replay-src` header appended to the request being replayed. |
|`elsewhere` | A boolean; if `true`, the responding instance will be excluded from the next round of load-balancing. |

## Example use cases

Send a write request from a read-only replica to the region in which a HA Postgres leader lives: `fly-replay: region=sjc` The proxy will get the request to an instance in that region and let the instances in the cluster take care of getting it to the writeable leader.

A router app that wants to send the request on to another app in the same org (perhaps to spin up a machine for a customer on demand): `fly-replay: app=another-app`. The proxy will send the request to an app instance in the nearest region that has one.

Replay the request to a specific instance, by its id as found ...  `fly-replay: instance=00bb33ff`

Example for state? (check Joshua's ruby post)

Fields can be stacked; for instance, to send the request on to an instance of the app "another-app" in the sjc region, use `fly-replay: region=sjc,app=another-app`. Some combinations of fields don't make sense (do we have a well-defined hierarchy of precedence, or error messages, for when fields conflict?). Don't specify an app name _and_ an instance ID where the instance doesn't belong to that app.

Related: [Multi-region PostgreSQL](/docs/getting-started/multi-region-databases/)