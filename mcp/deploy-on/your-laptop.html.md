---
title: Your Laptop
layout: framework_docs
objective: Demonstrates running an MCP server on your laptop and explores alternatives.
status: beta
order: 1
---

For an example of an MCP server running on your laptop, run:

<div class="important">
  As the MCP inspector is a Node.js application, you need to [Download and install Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) first. MacOS users can use [`brew install node`](https://formulae.brew.sh/formula/node).
</div>

```sh
fly mcp server -i
```

Navigate to http://127.0.0.1:6274 ; click Connect; then List Tools; then a tool like `fly-platform-status`, `fly-orgs-list`, `fly-apps-list`, or `fly-machines-list`; then fill out the form (if any) and click Run tool.

To see the same MCP server using an [MCP client](https://modelcontextprotocol.io/clients), a configuration like the following is used:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "/Users/rubys/.fly/bin/flyctl",
      "args": [
         "mcp",
         "server"
       ]
    }
  }
}
```

Adjust the flyctl path, restart your LLM (for example, Claude) and try out the tools.

The [Docker MCP Catalog and Toolkit announcement](https://www.docker.com/blog/announcing-docker-mcp-catalog-and-toolkit-beta/) identifies a number of problems and potential solutions with running MCP servers on your laptop.

Running an MCP server on a Fly Machine is easy and provides an additional level of security and isolation. It can also provide access to resources that are not on your laptop such as volumes, sqlite databases, and your application's internal state.