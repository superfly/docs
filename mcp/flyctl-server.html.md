---
title: flyctl mcp server
layout: framework_docs_overview
toc: false
order: 6
---

<a href="https://fly.io/blog/mcp-provisioning/">
![Scotty talking to a computer](/blog/mcp-provisioning/assets/Hello.webp)
</s>

## Adding fly mcp server to your LLM

```
fly mcp server --claude
```

You can also specify `--cursor`, `--neovim`, `--vscode`, `--windsurf`, or `--zed`. Or specify a configuration file path directly using `--config`.

`flyctl` provides an MCP server that you can use to provision your application. At the present time, most of the following commands and their subcommands are supported:

* [apps](https://fly.io/docs/flyctl/apps/)
* [logs](https://fly.io/docs/flyctl/logs/)
* [machine](https://fly.io/docs/flyctl/machine/)
* [orgs](https://fly.io/docs/flyctl/orgs/)
* [platform](https://fly.io/docs/flyctl/platform/)
* [status](https://fly.io/docs/flyctl/status/)
* [volumes](https://fly.io/docs/flyctl/volumes/)

## Running with the MCP inspector

You can explore the `flyctl mcp server` using the MCP inspector: 

<div class="important">
  As the MCP inspector is a Node.js application, you need to [Download and install Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) first. MacOS users can use [`brew install node`](https://formulae.brew.sh/formula/node).
</div>

```sh
fly mcp server -i
```

Navigate to http://127.0.0.1:6274 ; click Connect; then List Tools; then a tool like `fly-platform-status`, `fly-orgs-list`, `fly-apps-list`, or `fly-machines-list`; then fill out the form (if any) and click Run tool.

## Running on a separate machine

<div class="warning icon">
<b>Running this server remotely can give others access to run commands on your behalf. Read the following carefully before proceeding.</b>
</div>

Both `--sse` and `-stream` options are supported.

The default bind address is `127.0.0.1` which will only allow requests from the same machine. to override specify `--bind-addr`.

Authentication tokens come from (in priority order):

  * `bearer-token` from the `Authentication` header on the request
  * `--access-token` flag on the `fly mcp server` command
  * `FLY_ACCESS_TOKEN` environment variable

See [Access Tokens](https://fly.io/docs/security/tokens/) for information on how to obtain a token.

