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

We provide a [flyctl MCP server](./flyctl-server.html.md) for issuing flyctl commands:

```sh
fly mcp server --claude --server flyctl
```

## Fetch

Run [Fetch MCP server](https://github.com/modelcontextprotocol/servers/tree/main/src/fetch#fetch-mcp-server) where it doesn't have access to your local servers:

```sh
fly mcp launch "uvx mcp-server-fetch" --claude --server fetch
```

## Fly.io internal DNS

[mcp-internal-dns](https://github.com/fly-apps/mcp-internal-dns?tab=readme-ov-file#overview) enables your MCP client to query [Fly.io `.internal` DNS](https://fly.io/docs/networking/private-networking/#fly-io-internal-dns):

```sh
fly mcp launch "npx -y @flydotio/mcp-internal-dns" --claude --server dns
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

You can do the same thing with the [go mcp-filesystem-server](https://github.com/mark3labs/mcp-filesystem-server?tab=readme-ov-file#mcp-filesystem-server):

```sh
fly mcp launch "go run github.com/mark3labs/mcp-filesystem-server@latest /data/" \
  --claude --server volume --volume data:/data:initial_size=1GB
```

## GitHub

If you have the [Github CLI](https://cli.github.com/) installed, you can launch the [GitHub MCP Server](https://github.com/github/github-mcp-server?tab=readme-ov-file#github-mcp-server):

```sh
flyctl mcp launch --image ghcr.io/github/github-mcp-server \
  --secret GITHUB_PERSONAL_ACCESS_TOKEN=$(gh auth token) \
  --claude --server github --name git
```

## Desktop Commander

You can run [DesktopCommander](https://desktopcommander.app/) which requires a setup step:

```sh
fly mcp launch "npx @wonderwhy-er/desktop-commander@latest" \
  --claude --server desktop-commander \
  --setup "RUN npx -y @wonderwhy-er/desktop-commander@latest setup"
```