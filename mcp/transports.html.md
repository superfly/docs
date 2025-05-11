---
title: MCP Transports
layout: framework_docs_overview
toc: false
order: 1
---

The MCP standard define two types of base transports:
* [stdio](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#stdio)
* [Streaming HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http)

Previously there was also a
[Server Sent Events (SSE)](https://modelcontextprotocol.io/docs/concepts/transports#server-sent-events-sse) transport, which is now deprecated but still supported by a number of tools.

The MCP reference implementations in TypeScript and Python also support the notion of
[Custom](https://modelcontextprotocol.io/docs/concepts/transports#custom-transports) transports. The protocol implemented by
[`fly mcp proxy`](ttps://fly.io/docs/flyctl/mcp-proxy/) and
[`fly mcp wrap`](ttps://fly.io/docs/flyctl/mcp-wrap/) is an example of the types of protocols that mechanism is intended to support.

---

The [Everything MCP Server](https://github.com/modelcontextprotocol/servers/blob/main/src/everything/README.md) _attempts to exercise all the features of the MCP protocol. It is not intended to be a useful server, but rather a test server for builders of MCP clients. It implements prompts, tools, resources, sampling, and more to showcase MCP capabilities._. It currently supports stdio, SSE, and Streaming HTTP.

Below are instructions on how to deploy each on Fly.io.

One thing worth trying independent of the transport method you chose is the `printEnv` tool.  From the inspector click on tools at the top, then List Tools, then printEnv, and finally Run Tool.