---
title: Request headers
layout: docs
nav: firecracker
---

Request headers carry information that is specific to the incoming request and its path taken to the application. Request headers are added by the HTTP handler service.

## Request Headers

### `Fly-Client-IP`
**Client IP Address**: The IP address the Fly Proxy accepted a connection from. This will be the client making the initial request and as such, will also appear at the start of the `X-Forwarded-For` addresses. 

### `Fly-Forwarded-Port`
**Original connection port**: This header is always set by the Fly Proxy and denotes the actual port that the client connected to the Fly edge node which is then forwarded to the application instance.

### `Fly-Region`
**Edge Node Region**: This header is a three letter region code which represents the region that the connection was accepted in and routed from.

Not to be confused with the [environment variable](/docs/machines/runtime-environment/#fly_region) `FLY_REGION`, which is where the application is running.

### `X-Forwarded-For`
**Client and Proxy List**: This is a comma separated list comprising of the client that originated the request and the proxy servers the request passed through. For example, "77.97.0.98, 77.83.142.33" contains the client and the one proxy it passed through.

MDN has [full documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For) for this header.

### `X-Forwarded-Proto`
**Original client protocol**: The protocol which the client used to make the request. Either `http` or `https`.

### `X-Forwarded-Port`
**Original connection port**: This header may be set by the client and should denote the port that the client set out to connect to.

### `X-Forwarded-SSL`
**SSL Status**: This indicates if the client connected over SSL. Its value can be either `on` or `off`. 

## Request and Response Headers
### `Via`
**Proxy Route**: This header, added by proxies, shows the path taken, and protocols used, by the connection. MDN has [full documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Via) for this header. For example, a connection through the Fly edge may show `2 fly.io` in the field, denoting that version 2 of HTTP was used by the connection as it passed through the Fly Proxy.
