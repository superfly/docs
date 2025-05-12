---
title: flyctl server
layout: framework_docs_overview
toc: false
order: 5
---

<a href="https://fly.io/blog/mcp-provisioning/">
![Scotty talking to a computer](/blog/mcp-provisioning/assets/Hello.webp)
</s>

`flyctl` provides an MCP server that you can use to provision your application. At the present time, most of the following commands and their subcommands are supported:

* [apps](https://fly.io/docs/flyctl/apps/)
* [logs](https://fly.io/docs/flyctl/logs/)
* [machine](https://fly.io/docs/flyctl/machine/)
* [orgs](https://fly.io/docs/flyctl/orgs/)
* [platform](https://fly.io/docs/flyctl/platform/)
* [status](https://fly.io/docs/flyctl/status/)
* [volumes](https://fly.io/docs/flyctl/volumes/)

You can explore the `flyctl mcp server` using the MCP inspector: 

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