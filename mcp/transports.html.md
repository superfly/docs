---
title: MCP Transports
layout: framework_docs_overview
toc: false
order: 2
---

The MCP standard define two types of base transports:
[stdio](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#stdio) and
[Streaming HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http).
Previously there was also a
[Server Sent Events (SSE)](https://modelcontextprotocol.io/docs/concepts/transports#server-sent-events-sse) transport; this is now deprecated but still supported by a number of tools.

At the present time, MCPs that implement the stdio transport are by far most common, most interoperable, and is the transport we recommend.

Below are instructions on how to deploy each of these transport mechanisms on Fly.io using
the [Everything MCP Server](https://github.com/modelcontextprotocol/servers/blob/main/src/everything/README.md) provided by Anthropic which
_attempts to exercise all the features of the MCP protocol. It is not intended to be a useful server, but rather a test server for builders of MCP clients. It implements prompts, tools, resources, sampling, and more to showcase MCP capabilities._. It currently supports stdio, SSE, and Streaming HTTP.



One thing worth trying independent of the transport method you chose is the `printEnv` tool.  From the inspector click on tools at the top, then List Tools, then printEnv, and finally Run Tool.