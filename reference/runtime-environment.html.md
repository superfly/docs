---
title: The Fly Runtime Environment
layout: docs
sitemap: false
nav: firecracker
---

When a Fly application is running, various information about the runtime environment is made available to it. Environment variables carry information that is generally applicable to the instance. These values come from three sources.

* [Secrets](/docs/reference/secrets)
* The application's [env variable settings](/docs/reference/configuration/#the-env-variables-section) in fly.toml
* The Fly infrastructure, as detailed below.

Request headers carry information that is specific to the incoming request and its path taken to the application. Request headers are added by the HTTP handler service.

## _Environment Variables_

### `FLY_APP_NAME`
**Application Name**: Each application running on Fly has a unique Application Name. This identifies the application for the user and can also identify instances of the application running on Fly's 6PN networking. For example, `syd.$FLY_APP_NAME.internal` can refer to an instance of the app running. Read more about [6PN Naming](/docs/reference/services/#private-network-services) in the [Network Services](/docs/reference/services/) section.

### `FLY_ALLOC_ID`
**Allocation ID**: Each instance of an application running on Fly has a unique Allocation ID. This can be used, for example, to distinguish between instances running in the same region. `b996131a-5bae-215b-d0f1-2d75d1a8812b` is an example of the Allocation ID's format.

### `FLY_REGION`
**Region name**: The three-letter name of the region the application instance is running in. Details of current regions are listed in the [Regions](/docs/regions/) page. As an example, "ams" is the region name for Amsterdam.

## _Request Headers_

### `Fly-Client-IP`
**Client IP Address**: The IP address Fly accepted a connection from. This will be the client making the initial request and as such, will also appear at the start of the `X-Forwarded-For` addresses. 

### `Fly-Forwarded-Port`
**Original connection port**: This header is always set by Fly and denotes the actual port that the client connected to the Fly edge node which is then forwarded to the application instance.

### `Fly-Region`
**Edge Node Region**: This header is a three letter region code which represents the region that the connection was accepted in and routed from. Not to be confused with the environment variable `FLY_REGION` which is where the application is running.

### `X-Forwarded-For`
**Client and Proxy List**: This is a comma separated list comprising of the client that originated the request and the proxy servers the request passed through. For example, "77.97.0.98, 77.83.142.33" contains the client and the one proxy it passed through.

MDN has [full documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) for this header.

### `X-Forwarded-Proto`
**Original client protocol**: The protocol which the client used to make the request. Either `http` or `https`.

### `X-Forwarded-Port`
**Original connection port**: This header may be set by the client and should denote the port that the client set out to connect to.

### `X-Forwarded-SSL`
**SSL Status**: This indicates if the client connected over SSL. Its value can be either `on` or `off`. 

## _Request and Response Headers_

### `Via`
**Proxy Route**: This header, added by proxies, shows the path taken, and protocols used, by the connection. MDN has [full documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Via) for this header. For example, a connection through the Fly edge may show `2 fly.io` in the field, denoting that version 2 of HTTP was used by the connection as it passed through the fly.io proxy.







