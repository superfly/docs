---
title: fly mcp launch
layout: framework_docs_overview
toc: false
order: 1
---

Launching an `npx`, `uvx`, or docker image stdio MCP server into a Fly machine and configuring a MCP client to connect to it is a one-step process. The `fly mcp launch` command will create a new Fly machine, install the MCP server, and configure the MCP client to connect to it.

```sh
fly mcp launch "uvx mcp-server-time" --claude --server time
```

The above command specifies the command to run in the machine, selects the `claude` client to be the one to be configured using the server name `time`.

Support for Claude, Cursor, Neovim, VS Code, Windsurf, and Zed are built in.  You can also provide the path to the configuration file. You can also provide multiple clients and configuration files at once.

By default, bearer token authentication will be set up on both the server and client, though there are other options and this can be disabled.

You can configure auto-stop, file contents, flycast, secrets, region, and vm sizes.

See [Examples](../examples/) for a number of examples.

See the [`fly mcp launch` documentation](https://fly.io/docs/flyctl/mcp-launch/) for more details on the command and its options.

## Inspect

You can use the [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) to test and debug your MCP server:

<div class="important">
  As the MCP inspector is a Node.js application, you need to [Download and install Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) first. MacOS users can use [`brew install node`](https://formulae.brew.sh/formula/node).
</div>

```
fly mcp inspect --claude --server time
```

This command is simply a convenience, all it does is run the inspector set up to connect to the same machine, authentication, and arguments as the MCP client (in this case, Claude) would.

## Destroy

When you no longer need the MCP, you can destroy it:

```
fly mcp destroy --claude --server time
```

This will also remove the configuration entry from the MCP client.