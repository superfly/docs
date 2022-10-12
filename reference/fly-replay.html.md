---
title: The Fly-Replay Header
layout: docs
sitemap: false
nav: firecracker
---

The `fly-replay` response header is a way for an instance of an app to respond to an HTTP request by asking the Fly proxy to redeliver (replay) it somewhere else within the same Fly organization. The content of the `fly-replay` header fields tells our proxy which magic to perform, and the proxy takes it from there.

## `fly-replay`

|Field |Description |
|---|---|
|`region` | The 3-letter code for a region to which the request should be routed. |
|`instance` | The ID of a specific instance to which the request should be routed. |
|`app` | The name of an app within the same organization, to which the request should be routed.<br>fly-proxy will choose the nearest instance.|
|`state` | Optional arbitrary string to include in the `fly-replay-src` header appended to the request being replayed. |
|`elsewhere` | Boolean. If `true`, the responding instance will be excluded from the next round of load-balancing. |

## `fly-replay-src`

Our proxy appends a header, `fly-replay-src`, to the replayed HTTP request, with information about the instance that sent the `fly-replay`. 

|Field |Description |
|---|---|
|`instance` | The ID of the instance emitting `fly-replay`. |
|`region` | The region `fly-replay` was sent from. |
|`t` | A timestamp: microseconds since the Unix epoch. |
|`state` | The contents of the `state` field of the `fly-replay` header, if any. |

## Example use cases

[Send a write request from a read-only replica](/docs/postgres/#high-availability-and-global-replication) to the region in which a HA database leader lives: 
```
fly-replay: region=sjc
``` 
The proxy will get the request to an instance in that region and let the instances in the cluster take care of getting it to the writeable leader.

Send the request to an instance of a different app in the same organization, in the nearest region that has one:
```
fly-replay: app=app-in-same-org
```
This can be used for cross-app replays; think a router app for a FaaS that wants to spin up a customer [VM](/docs/reference/machines/) on demand.

Replay the request to a specific instance by ID:  
```
fly-replay: instance=00bb33ff
```

Tell the target instance why the request was routed to it (where the recipient app has logic to make use of that information):
```
fly-replay: region=sjc;state=captured_write
```

Fields can be stacked; for instance, to send the request on to an instance of the app "app-in-same-org" in the sjc region:
```
fly-replay: region=sjc;app=app-in-same-org 
```

Some combinations of fields can conflict: e.g. don't specify an app name and an instance ID that doesn't belong to that app.

Related: [Multi-region PostgreSQL](/docs/postgres/#high-availability-and-global-replication); [Run Ordinary Rails Apps Globally](/blog/run-ordinary-rails-apps-globally/)