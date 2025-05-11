---
title: Streaming HTTP
layout: framework_docs
objective: Streaming HTTP servers can be deployed as is.
toc: false
order: 3
---

Streaming HTTP servers can be run as is, we just need to identify the port used and adjust the command, and disable the smoke checks as they will confuse the server.

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





