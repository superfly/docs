---
title: fly launch
layout: framework_docs
objective: This guide shows you how to use flyctl launch to create a Fly.io machine that runs an MCP server remotely.
status: beta
order: 1
---

[Fly launch](https://fly.io/docs/reference/fly-launch/) is a bundle of features that take a lot of the work out of deploying and managing your Fly App.

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

Optional parameters include `--name`, `--org`, and `--flycast`.

Review and accept the defaults.

The Dockerfile will be build, and the resulting image will be pushed and deployed.  In the process, a volume will be allocated and both a shared ipv4 and a dedicated ipv6 address will be allocated.

Your configuration will be found in [`fly.toml`](https://fly.io/docs/reference/configuration/).

If you make any change to your `Dockerfile` or `fly.toml`, run [`fly deploy`](https://fly.io/docs/flyctl/deploy/) to apply the changes.

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
