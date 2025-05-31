---
title: Streaming HTTP
layout: framework_docs
objective: Streaming HTTP servers can be deployed as is.
status: beta
order: 3
---

Streaming HTTP servers can be run as is, we just need to identify the port used and adjust the command, and disable the smoke checks as they will confuse the server.

Start by cloning the MCP servers git repository and making a copy of the `Dockerfile`:

```sh
git clone https://github.com/modelcontextprotocol/servers.git
cd servers
cp src/everything/Dockerfile .
```

Make the following changes to the `Dockerfile`:

```diff
 RUN npm ci --ignore-scripts --omit-dev
+
+EXPOSE 3001

-CMD ["node", "dist/index.js"]
+CMD ["node", "dist/streamableHttp.js"]
```

Now run:

```sh
fly launch --ha=false --smoke-checks=false
```

Access the MCP server via the MCP inspector:

```sh
npx @modelcontextprotocol/inspector
```

In the top left, change the transport type to **Streamable HTTP**.

Set the URL to match your application, where the URL will be of the form:

```
https://appname.fly.dev/mcp
```

Replace the _appname_ with the name of your application, but keep the `https://` and `/mcp`.

Click Connect.

An example Cursor configuration:

```json
{
  "mcpServers": {
    "everything": {
      "url": "https://appname.fly.dev/mcp",
      "env": {}
    }
  }
}
```

With Streaming HTTP transports, [`fly mcp proxy`](https://fly.io/docs/flyctl/mcp-proxy/) may not be required, but could be useful if:
* Your MCP client doesn't support Streaming HTTP
* You need to set up a [wireguard tunnel](https://fly.io/docs/flyctl/proxy/) to access your MCP serever via an [`.internal`](https://fly.io/docs/networking/private-networking/) or [`.proxy`](https://fly.io/docs/networking/flycast/) address.
* You need to [route the request to a specific machine](https://fly.io/docs/networking/dynamic-request-routing/#the-fly-force-instance-id-header).