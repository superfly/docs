---
title: Deploying Remote MCP Servers
layout: docs
nav: firecracker
date: 2025-04-11
---
The Model Context Protocol (MCP) is a fun new way to give LLMs new powers. Originally developed by Anthropic, the protocol has since been adopted by OpenAI (with Google Gemini support in the works at the time of writing).

The protocol defines a standardized way of connecting tools and providing additional context to LLMs, not dissimilar to the way USB provides a standardized way to connect computers to peripherals and devices. Fly Machines are tightly isolated VMs that are perfect for running MCP servers.

This blueprint will help you understand, at a very high level, how to build, deploy, and connect remote MCP servers on Fly.io. Keep in mind that this is an nascent, still-emerging protocol – details are subject to change. For specific implementation details,  the [Model Context Protocol](https://modelcontextprotocol.io/) site is the authoritative source of truth (complete with [a handy .txt version for LLM prompting](https://modelcontextprotocol.io/llms-full.txt)).

## Remote MCP Servers

MCP to date has been largely local-only, but the protocol also [specs out transports](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports) for remote MCP servers. Remote MCP servers solve a bunch of problems:

- Easier to update a centralized server instead of dispersed, local packages
- You can give  MCP clients persistent connections that don't evaporate when someone closes their laptop
- Securely sandbox MCP server activity in case the robots go rogue

## Single Tenant or Multi-tenant

There are broadly two patterns you might want to follow when deploying a remote MCP server to Fly.io:

1. Single, multi-tenant MCP server 
1. Single-tenant, per-user MCP servers 

We're partial to the single-tenant pattern – it ensures proper isolation, and also helps with minimize your Fly.io bill: unused Machines can stop and start as needed, so you won't waste resources on idle users. `fly-replay` makes it easy to route requests to the correct app / Fly Machine (see more detail about this pattern in [Per-user Dev Environments with Fly Machines](https://fly.io/docs/blueprints/per-user-dev-environments/)).

## Multi-tenant MCP Servers

<img src="/static/images/docs-mcp-multi-tenant.webp" alt="Diagram showing multi-tenant MCP server architecture on Fly.io">

You'll need two main components:

1. **MCP-Remote Shim (optional)**: Tiny client-side proxy that connects local MCP clients to your remote servers (only needed if the MCP client doesn't support auth and / or streamable HTTP requests to a remote MCP server). Handles authentication via a secret shared between the shim and the router app (authentication could be a simple API token or a full OAuth dance). Securely stores and refreshes tokens as needed.
1. **MCP Server App**: This runs the actual MCP goodness and authenticates requests from the MCP client. Should have a single streamable HTTP endpoint path for MCP client connections, as well as any specific business logic or other integrations. 

## Single-tenant MCP Servers

<img src="/static/images/docs-mcp-single-tenant.webp" alt="Diagram showing single-tenant MCP server architecture on Fly.io">

There are three main components:

1. **Router App**: Handles auth, and routes requests to per-user apps + Fly Machines with `fly-replay` magic. Optionally handles user management and permissions. 
1. **MCP Server Apps**: Per-user (or per-team) apps that run your actual MCP goodness. Should have a single streamable HTTP endpoint path for MCP client connections, as well as any specific business logic or other integrations. 
- **MCP-Remote Shim (optional)**: Tiny client-side proxy that connects local MCP clients to your remote servers (only needed if the MCP client doesn't support auth and / or streamable HTTP requests to a remote MCP server). Handles authentication via a secret shared between the shim and the router app (authentication could be a simple API token or a full OAuth dance). Securely stores and refreshes tokens as needed.

## How Users Experience It

From your users' perspective, the experience should be delightfully simple:

1. They add a new MCP server to their MCP client with a simple one-liner
1. The user is walked through an authentication flow (ie a browser window pops open to kick off the OAuth dance or provide an API key)
1. After logging in, the MCP client can now access all the tools you've exposed
1. The connection persists across restarts without re-authentication

## Taking It Further

If you'd like your MCP servers to connect to third party OAuth APIs without having to directly handle API tokens, consider using [ssokenizer](https://github.com/superfly/ssokenizer) (or [tokenizer](https://github.com/superfly/tokenizer) for generic, non-OAuth flows).