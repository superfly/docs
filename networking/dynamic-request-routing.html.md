---
title: Dynamic Request Routing
layout: docs
nav: firecracker
redirect_from:
  - /docs/reference/fly-replay/
  - /docs/reference/regional-request-routing/
  - /docs/reference/dynamic-request-routing/
---

Traffic sent to multi-region Fly.io apps is automatically routed to the region nearest to the client, thanks to Anycast-enabled IP addresses. [Read more about Anycast on Wikipedia](https://en.wikipedia.org/wiki/Anycast).

Sometimes it's useful, or necessary, to route requests to other regions, other apps, or both. You can use custom request and response HTTP headers to achieve this.

## The `fly-replay` response header

Apps may append a `fly-replay` header to responses. This instructs [Fly Proxy](/docs/reference/fly-proxy) to redeliver (replay) the original request in another region, or to replay it to another app in the same organization.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/riCh9Xeuf0s?si=IxOEzTX_4Osv3OTo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><br/>

The content of the `fly-replay` header fields tells Fly Proxy which magic to perform, and the proxy takes it from there. If the target region doesn't host any healthy Machines for the target app, the proxy throws an error.

|Field |Description |
|---|---|
|`region` | The 3-letter code for the [region](/docs/reference/regions/) to which the request should be routed. |
|`instance` | The ID of the specific Machine to which the request should be routed. |
|`app` | The name of the app within the same organization, to which the request should be routed.<br>Fly Proxy will choose the nearest Machine if no region is specified.|
|`state` | Optional arbitrary string to include in the `fly-replay-src` header appended to the request being replayed. |
|`elsewhere` | Boolean. If `true`, the responding Machine will be excluded from the next round of load-balancing. |

### Limitations

Attempting to replay requests larger than 1MB will throw an error. If you need certain requests - like file uploads - to be handled by a specific region, consider the following workarounds.

If your service is simply proxying uploads to object storage, some services like S3 allow [uploading directly from the browser](https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application/+external). Rails supports this [out of the box](https://guides.rubyonrails.org/active_storage_overview.html#direct-uploads+external).

If you can perform uploads via `fetch` or `XMLHttpRequest`, you can prepend the [fly-prefer-region](#the-fly-prefer-region-request-header) or [fly-force-instance-id](#the-fly-force-instance-id-request-header) header to send the request directly to a specific region.


## `fly-replay` use cases

Here are a few example use cases for the `fly-replay` response header.

### Replaying writes in secondary regions

Fly.io Postgres supports [global read replicas](/docs/postgres/high-availability-and-global-replication) for speeding up reads in regions close to users.

Replay a request to the region where the HA database leader lives:

```
fly-replay: region=sjc
```

Fly Proxy will get the request to a Machine in that region and let the instances in the cluster take care of getting it to the writeable leader.

Check out our blueprint for [Multi-region databases and fly-replay](/docs/blueprints/multi-region-fly-replay/).

### Replay requests to other apps

`fly-replay` can replay requests across apps in the same organization. Think of a router app for a FaaS that wants to spin up a customer [Machine](/docs/machines/) on demand.

To send the request to a different app in the same organization, in the nearest region that has a Machine:

```
fly-replay: app=app-in-same-org
```

### Replay requests to specific Machines

Replay the request to a specific Machine by ID:

```
fly-replay: instance=00bb33ff
```

### Pass state to replay targets

The request replay target may need to know why the request was routed to it:

```
fly-replay: region=sjc;state=captured_write
```

Fields can be stacked; for instance, to send the request on to an Machine in the app "app-in-same-org" in the sjc region:

```
fly-replay: region=sjc;app=app-in-same-org
```

Some combinations of fields can conflict. For example, don't specify an app name and a Machine ID that doesn't belong to that app.

Related: [Multi-region PostgreSQL](/docs/postgres/high-availability-and-global-replication); [Run Ordinary Rails Apps Globally](/blog/run-ordinary-rails-apps-globally/)

## The `fly-replay-src` request header

When replaying an HTTP request, Fly Proxy appends the `fly-replay-src` header with information about the Machine that sent the `fly-replay`.

|Field |Description |
|---|---|
|`instance` | The ID of the Machine emitting `fly-replay`. |
|`region` | The region `fly-replay` was sent from. |
|`t` | A timestamp: microseconds since the Unix epoch. |
|`state` | The contents of the `state` supplied by the `fly-replay` header, if any. |

See how the [official Fly.io Ruby client](https://github.com/superfly/fly-ruby/blob/main/lib/fly-ruby/regional_database.rb#L74-L76+external) uses the `state` and `t` fields to prevent [read-your-own-write](https://jepsen.io/consistency/models/read-your-writes+external) inconsistency.

## The `fly-prefer-region` request header

Clients accessing Fly.io apps may set the `fly-prefer-region` header to attempt sending the request directly to a desired target region. This is useful for cases where `fly-replay` isn't practical, such as large file uploads which can't be replayed once buffered by Fly Proxy.

If the target region has no healthy Machines, the region nearest to the client with healthy Machines will field the request.

Example:

```
fly-prefer-region: ams
```

## The `fly-force-instance-id` request header

Clients accessing Fly.io apps may set the `fly-force-instance-id` header to ensure that the request is sent to only a specific Machine.

If the Machine is deleted or not found, no other Machines will be tried.

Example:

```
fly-force-instance-id: 90801679a10038
```

<div class="note icon">
**Note**: The value of this header is the Machine ID, which you can get by running `fly status` or `fly machines list`.
</div>
