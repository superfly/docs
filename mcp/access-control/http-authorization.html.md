---
title: HTTP Authorization
layout: framework_docs
objective: Shows how to add HTTP authorization to an MCP proxy
status: beta
order: 1
---

The HTTP Streaming transport [specifies](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization) [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-12) for authentication.  To work this needs to be implemented in both the MCP client and the MCP server. As of Spring 2025, this is not yet widely implemented.

The SSE transport only [specified](https://modelcontextprotocol.io/docs/concepts/transports#server-sent-events-sse) _Implement proper authentication for all SSE connections_. As again this needs to be implemented in both the MCP client and MCP server to work, this guidance is not sufficient for interoperability. THe [MCP inspector](https://modelcontextprotocol.io/docs/tools/inspector) lets you set a bearer token, and there are some who followed this lead. That being said, the SSE transport is now deprecated.

For stdio transports, there is no authentication; that is left entirely up to [fly mcp proxy](https://fly.io/docs/flyctl/mcp-wrap/) and [fly mcp wrap](https://fly.io/docs/flyctl/mcp-wrap/). As these commands are designed to be used with an MCP server that was only intended to be used by a single user at a time, OAuth is substantial overkill for this purpose. Instead these commands support both [basic](https://datatracker.ietf.org/doc/html/rfc7617) and bearer [HTTP Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Authorization).

To use basic authentication, set two secrets in your application.  For example:

```sh
fly secrets set FLY_MCP_USER=Admin FLY_MCP_PASSWORD=S3cr3t
```

To use bearer authentication, set one secret in your application.  For example:

```sh
fly secrets set FLY_MCP_BEARER_TOKEN=T0k3n
```

If you are using MacOs, Linux, or WSL2, the following command may be useful for generating a token:

```sh
openssl rand -base64 18
```

And then on the client side pass the same values to the proxy as flags:

For basic:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "/Users/rubys/.fly/bin/flyctl",
      "args": [
         "mcp",
         "proxy",
         "--url=https://mcp.fly.dev/",
         "--user",
         "Admin",
         "--password",
         "S3cr3t"
       ]
    }
  }
}
```

For bearer:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "/Users/rubys/.fly/bin/flyctl",
      "args": [
         "mcp",
         "proxy",
         "--url=https://mcp.fly.dev/",
         "--bearer-token",
         "T0k3n"
       ]
    }
  }
}
```

From a security point of view, there is not a substantial difference between these two authentication methods. Pick the one you fine most convenient.
