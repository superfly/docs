---
title: Deploying Remote MCP Servers
layout: docs
nav: firecracker
date: 2025-04-15
---
The Model Context Protocol (MCP) is a fun new way to give LLMs new powers. Originally developed by Anthropic, the protocol has since been adopted by OpenAI (with Google Gemini support in the works at the time of writing).

The protocol defines a standardized way of connecting tools and providing additional context to LLMs, not dissimilar to the way USB provides a standardized way to connect computers to peripherals and devices. Fly Machines are tightly isolated VMs that are perfect for running MCP servers.

This blueprint will help you understand, at a very high level, how to build, deploy, and connect remote MCP servers on Fly.io. Keep in mind that this is an nascent, still-emerging protocol – details are subject to change. For specific implementation details,  the [Model Context Protocol](https://modelcontextprotocol.io/) site is the authoritative source of truth (complete with [a handy .txt version for LLM prompting](https://modelcontextprotocol.io/llms-full.txt)).

We've also started to integrate some MCP tooling into the `flyctl` that should give you a more concrete sense of how you might deploy MCP servers on Fly.io (read more in [this community forum post](https://community.fly.io/t/running-mcps-on-and-with-fly-io/24588)). Note that our MCP implementation is experimental and may still have sharp edges!

## Remote MCP Servers

MCP to date has been largely local-only, but the protocol also [specs out transports](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports) for remote MCP servers. Remote MCP servers solve a bunch of problems:

- Easier to update a centralized server instead of dispersed, local packages
- You can give  MCP clients persistent connections that don't evaporate when someone closes their laptop
- Securely sandbox MCP server activity in case the robots go rogue

## Single Tenant or Multi-tenant

There are broadly two patterns you might want to follow when deploying a remote MCP server to Fly.io:

1. Multi-tenant MCP server (one app, many users)
2. Single-tenant MCP servers (one app per user)

We're partial to the single-tenant pattern – it ensures proper isolation, and also helps with minimize your Fly.io bill: unused Machines can stop and start as needed, so you won't waste resources on idle users. `fly-replay` makes it easy to route requests to the correct app / Fly Machine (see more detail about this pattern in [Per-user Dev Environments with Fly Machines](https://fly.io/docs/blueprints/per-user-dev-environments/)).

## Multi-tenant MCP Servers

<img src="/static/images/docs-mcp-multi-tenant.webp" alt="Diagram showing multi-tenant MCP server architecture on Fly.io">

You'll need two main components:

1. **MCP-Remote Shim (optional)**: Tiny client-side proxy that connects local MCP clients to your remote servers (only needed if the MCP client doesn't support auth and / or streamable HTTP requests to a remote MCP server). Handles authentication via a secret shared between the shim and the router app (authentication could be a simple API token, username + password, or a full OAuth dance). Securely stores and refreshes tokens as needed. To see an example, try the experimental `fly mcp proxy` command in the `flyctl`. This sets up a local proxy that forwards MCP client requests to a remote URL (more details in [the docs](https://fly.io/docs/flyctl/mcp) and [the community forum](https://community.fly.io/t/running-mcps-on-and-with-fly-io/24588)).
2. **MCP Server App**: This runs the actual MCP goodness and authenticates requests from the MCP client. Should have a single streamable HTTP endpoint path for MCP client connections, as well as any specific business logic or other integrations. To try our implementation, include the experimental `fly mcp wrap` command in the Dockerfile for your MCP server app. This instantiates a lightweight HTTP server to receive requests forwarded from the local MCP client via `fly mcp proxy` (more details in [the docs](https://fly.io/docs/flyctl/mcp) and [the community forum](https://community.fly.io/t/running-mcps-on-and-with-fly-io/24588)).

## Single-tenant MCP Servers

<img src="/static/images/docs-mcp-single-tenant.webp" alt="Diagram showing single-tenant MCP server architecture on Fly.io">

There are three main components:

1. **Router App**: Receives requests from the MCP client and handles auth, then routes requests to per-user apps + Fly Machines with `fly-replay`. Optionally handles user management and permissions. You can use the experimental `fly mcp wrap` command in the Dockerfile of your router app to instantiate a lightweight HTTP server to receive requests forwarded from a local MCP client (more details in [the docs](https://fly.io/docs/flyctl/mcp) and [the community forum](https://community.fly.io/t/running-mcps-on-and-with-fly-io/24588)). Note that `fly mcp wrap` does not handle request routing – you'll have to implement that separately.
2. **MCP Server Apps**: Per-user (or per-team) apps that run the actual MCP goodness. Should have a single streamable HTTP endpoint path for MCP client connections, as well as any specific business logic or other integrations. 
3. **MCP-Remote Shim (optional)**: Tiny client-side proxy that connects local MCP clients to your remote servers (only needed if the MCP client doesn't support auth and / or streamable HTTP requests to a remote MCP server). Handles authentication via a secret shared between the shim and the router app (authentication could be a simple API token, username + password, or a full OAuth dance). Securely stores and refreshes tokens as needed. To see an example, try the experimental `fly mcp proxy` command in the `flyctl`, which sets up a local proxy that forwards MCP client requests to a remote URL (more details in [the docs](https://fly.io/docs/flyctl/mcp) and [the community forum](https://community.fly.io/t/running-mcps-on-and-with-fly-io/24588)).

## How Users Experience It

From your users' perspective, the experience should be delightfully simple:

1. They add a new MCP server to their MCP client with a simple one-liner
2. If needed, the user is walked through an authentication flow (ie a browser window pops open to kick off the OAuth dance or provide an API key)
3. After logging in, the MCP client can now access all the tools you've exposed
4. The connection persists across restarts without re-authentication

## Taking It Further

If you'd like your MCP servers to connect to third party OAuth APIs without having to directly handle API tokens, consider using [ssokenizer](https://github.com/superfly/ssokenizer) (or [tokenizer](https://github.com/superfly/tokenizer) for generic, non-OAuth flows).