---
title: A Fly Machine
layout: framework_docs
objective: Demonstrates using flyctl launch to create a Fly.io machine that runs an MCP server remotely.
status: beta
order: 1
---

[Fly Machines](https://fly.io/docs/machines/) are fast-launching VMs; they can be started and stopped at subsecond speeds. We give you control of your Machine count and each Machine’s lifecycle, resources, and region placement with a simple REST API or flyctl commands.

This guide presumes that you have [flyctl installed](https://fly.io/docs/flyctl/install/), and have successfully run either
[`fly auth signup`](https://fly.io/docs/flyctl/auth-signup/) or [`fly auth login`](https://fly.io/docs/flyctl/auth-login/).

The first step is intended to be run in an empty directory.

## Create your app

Create a Dockerfile with the following contents:

```dockerfile
FROM flyio/mcp
VOLUME /data
CMD [ "npx", "-f", "@modelcontextprotocol/server-filesystem", "/data/" ]
```

Now use the [fly launch](https://fly.io/docs/flyctl/launch/) command:

```sh
fly launch
```

Review and accept the defaults.

The Dockerfile will be build, and the resulting image will be pushed and deployed.  In the process, a volume will be allocated and both a shared ipv4 and a dedicated ipv6 address will be allocated.

## Accessing the MCP via an inspector

<div class="important">
  As the MCP inspector is a Node.js application, you need to [Download and install Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) first. MacOS users can use [`brew install node`](https://formulae.brew.sh/formula/node).
</div>

You are test out your MCP server using the [MCP inspector](https://modelcontextprotocol.io/docs/tools/inspector):

```sh
fly mcp proxy -i
```

Navigate to http://127.0.0.1:6274 ; click Connect; then List Tools; select any tool; fill out the form (if any) and click Run tool.

## Configure your LLM

Here’s an example `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "/Users/rubys/.fly/bin/flyctl",
      "args": [
         "mcp",
         "proxy",
         "--url=https://mcp.fly.dev/"
       ]
    }
  }
}
```

Adjust the flyctl path and the value of the --url, restart your LLM (in this case, Claude) and try out the tools.
