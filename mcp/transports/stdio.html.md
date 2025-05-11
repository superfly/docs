---
title: stdio
layout: framework_docs
objective: This guide shows you how to wrap and proxy a stdio MCP server so that it can be deployed remotely.
order: 1
---

stdio MCP servers are not intended to be run remotely, but [`fly mcp`](https://fly.io/docs/flyctl/mcp/) provides the ability to proxy and wrap them.

```sh
git clone https://github.com/modelcontextprotocol/servers.git
cd servers
cp src/everything/Dockerfile .
```
 
Make the following changes to the `Dockerfile`:

```diff
 RUN npm ci --ignore-scripts --omit-dev
+
+COPY --from=flyio/flyctl /flyctl /usr/bin
+ENTRYPOINT [ "/usr/bin/flyctl", "mcp", "wrap", "--" ]
+EXPOSE 8080

 CMD ["node", "dist/index.js"]
```

Now run:

```sh
fly launch --ha=false
```

Access the MCP server via the MCP inspector:

```sh
fly mcp proxy -i
```

An example `claude_desktop_config.json`:

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

Adjust the `flyctl` path and the value of the `--url` to match your needs.
