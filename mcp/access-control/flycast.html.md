---
title: Wireguard tunnels and Flycast
layout: framework_docs
objective: Shows how to use a wireguard tunnel and flycast to access a proxy
status: beta
order: 2
---

The best way not to let randos on the internet access to your MCP server is to not put the MCP server on the internet in the first place.

Every Fly Organization has a [private network](https://fly.io/docs/networking/private-networking/). In most cases, you will want **only** a private v6 address on applications that are not available on the internet.

When using:
  * The Machine API, specify `private_v6`.
  * `fly ips`, specify `allocate-v6 --private`
  * `fly launch`, specify `--flycast`

With this in place you can use [`fly proxy`](https://fly.io/docs/flyctl/proxy/) to create a tunnel, or you can follow our blueprint to [Jack into your private network with WireGuard](https://fly.io/docs/blueprints/connect-private-network-wireguard/).

With `fly mcp proxy`, this support is built in. To use, simply specify a `--url` ending in `.internal` or `.flycast`.
 * `.internal` addresses can be used to target individual machines or regions, but can only be used to access machines that are started. Just remember that the protocol to use is `http` not `https`, and the port you want to use it the _internal_ port. So an typical URL would look like `http://mcp.internal:8080/`.
 *  `.flycast` addresses target an _external_ port for your application, and supports [fly routing headers](https://fly.io/docs/networking/dynamic-request-routing/#alternative-routing-headers). If your request is routed to a machine that is stopped or suspended, that machine will be started first. Again the protocol to use is `http` not `https`, so an typical URL would look like `http://mcp.flycast/`.

 [Flycast - Private Fly Proxy services](https://fly.io/docs/networking/flycast/) provides more information on the use of Flycast.

 `fly mcp wrap` has a `--private` flag which will cause the proxy to respond with a `403 Forbidden` response to all requests that do not come in via the private network. This may be useful when combined with containers and machines with multiple services, some of which are public but the MCP server is private.