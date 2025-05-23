---
title: Examples
layout: framework_docs_overview
toc: false
order: 7
---

While MCPs and Fly.io have a lot of concepts, when launching MCPs on Fly.io you generally only have to worry about:
  * Host tool (examples: Claude, Cursor, Neovim, VSCode, Windsurf, Zed)
  * MCP server name.  If you are using, for example, Claude as your host and connect multiple MCP servers to it, you need to give each MCP server a name.
  * Secrets. If you see places in the docs where they tell you to put secrets in environment variables, you will instead put them in secrets. Your MCP servers will be able to access these secrets, but your host tool will not.

That's it.  You don't have to worry about streaming, authentication, `fly.toml`.

Try some of the following commands.  After running them, restart Claude and ask it what tools it has access to.

## flyctl server

We provide a MCP server for issuing flyctl commands:

```sh
fly mcp server --claude --server flyctl
```

This will add the [flyctl MCP server](./flyctl-server.html.md) to the Claude configuration with the name of `flyctl`.

## Fetch

[Fetch MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch#fetch-mcp-server)

```sh
fly mcp launch "uvx mcp-server-fetch" --claude --server fetch
```

## Slack

Look at the Slack [setup](https://github.com/modelcontextprotocol/servers/blob/main/src/slack/README.md#setup) instructions and obtain a _Bot User OAuth Token_ and _Team ID_, then run:

```sh
fly mcp launch \
  "npx -y @modelcontextprotocol/server-slack" \
  --claude --server slack \
  --secret SLACK_BOT_TOKEN=xoxb-your-bot-token \
  --secret SLACK_TEAM_ID=T01234567
```

### Filesystem / volume

The [Filesystem MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) can be paired with a Fly.io volume:

```sh
fly mcp launch "npx -y @modelcontextprotocol/server-filesystem /data/" \
  --claude --server volume --volume data:/data:initial_size=1GB
```

## GitHub

If you have the Github CLI installed, you can launch the [GitHub MCP Server](https://github.com/github/github-mcp-server?tab=readme-ov-file#github-mcp-server):

```sh
flyctl mcp launch --image ghcr.io/github/github-mcp-server \
  --secret GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token) \
  --claude --server github --name git
```
