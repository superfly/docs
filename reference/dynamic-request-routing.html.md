---
title: Dynamic Request Routing
layout: docs
sitemap: false
nav: firecracker
redirect_from:
  - /docs/reference/fly-replay/
  - /docs/reference/regional-request-routing/
---

Traffic sent to multi-region Fly.io apps is automatically routed to the region nearest to the client, thanks to Anycast-enabled IP addresses. [Read more Anycast on on Wikipedia](https://en.wikipedia.org/wiki/Anycast).

Sometimes it's useful, or necessary, to route requests to other regions, other apps, or both. You can use custom request and response HTTP headers to achieve this.

## The `fly-replay` response header

Apps may append a `fly-replay` header to responses. This instructs the Fly proxy to redeliver (replay) the original request in another region, or to replay it to another app in the same Fly organization.

The content of the `fly-replay` header fields tells our proxy which magic to perform, and the proxy takes it from there. If the target region doesn't host any healthy instances for the target app, the proxy throw an error.

|Field |Description |
|---|---|
|`region` | The 3-letter code for a region to which the request should be routed. |
|`instance` | ID of a specific instance to which the request should be routed. |
|`app` | The name of an app within the same organization, to which the request should be routed.<br>fly-proxy will choose the nearest instance if no region is specified.|
|`state` | Optional arbitrary string to include in the `fly-replay-src` header appended to the request being replayed. |
|`elsewhere` | Boolean. If `true`, the responding instance will be excluded from the next round of load-balancing. |

### Limitations

Attempting to replay requests larger than 1MB will throw an error. If you need certain requests - like file uploads - to be handled by a specific region, consider the following workarounds.

If your service is simply proxying uploads to object storage, some services like S3 allow [uploading directly from the browser](https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/). Rails supports this [out of the box](https://guides.rubyonrails.org/active_storage_overview.html#direct-uploads).

If you can perform uploads via `XMLHTTPRequest` (aja Ajax), you can prepend the [fly-prefer-region](#the-fly-prefer-region-request-header) header to send the request directly to that region.


## `fly-replay` use cases

Here are a few example use cases for the `fly-replay' response header.

### Replaying writes in secondary regions

Fly.io Postgres supports [global read replicas](/docs/postgres/high-availability-and-global-replication) for speeding up reads in regions close to users.

Replay a request to the region where the HA database leader lives:
```
fly-replay: region=sjc
```

The proxy will get the request to an instance in that region and let the instances in the cluster take care of getting it to the writeable leader.

### Replay requests to other apps

`fly-replay` can replay requests across apps in the same organization. Think of a router app for a FaaS that wants to spin up a customer [VM](/docs/reference/machines/) on demand.

To send the request to an instance of a different app in the same organization, in the nearest region that has one:
```
fly-replay: app=app-in-same-org
```

### Replay requests to specific VMs

Replay the request to a specific VM by ID:
```
fly-replay: instance=00bb33ff
```

### Pass state to replay targets

The request replay target may need to know why the request was routed to it.
```
fly-replay: region=sjc;state=captured_write
```

Fields can be stacked; for instance, to send the request on to an instance of the app "app-in-same-org" in the sjc region:
```
fly-replay: region=sjc;app=app-in-same-org
```

Some combinations of fields can conflict: e.g. don't specify an app name and an instance ID that doesn't belong to that app.

Related: [Multi-region PostgreSQL](/docs/postgres/high-availability-and-global-replication); [Run Ordinary Rails Apps Globally](/blog/run-ordinary-rails-apps-globally/)

## The `fly-replay-src` request header

When replaying an HTTP request, our proxy appends the `fly-replay-src` header with information about the instance that sent the `fly-replay`.

|Field |Description |
|---|---|
|`instance` | The ID of the instance emitting `fly-replay`. |
|`region` | The region `fly-replay` was sent from. |
|`t` | A timestamp: microseconds since the Unix epoch. |
|`state` | The contents of the `state` supplied by the `fly-replay` header, if any. |

[See how the official Fly.io Ruby client](https://github.com/superfly/fly-ruby/blob/main/lib/fly-ruby/regional_database.rb#L74-L76) uses the `state` and `t` fields to prevent [read-your-own-write](https://jepsen.io/consistency/models/read-your-writes) inconsistency.

## The `fly-prefer-region` request header

Clients accessing Fly.io apps may append the `fly-prefer-region` header to attempt sending the request directly to a desired target region. This is useful for cases where `fly-replay` isn't practical, such as large file uploads which can't be replayed once buffered by the proxy.

If the target regions hosts no healthy instances, the nearest region with healthy instances will field the request.

Example:
```
fly-prefer-region: ams
```