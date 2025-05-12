---
title: Your application
layout: framework_docs
objective: Demonstrates running an MCP server in a container on a fly machine
status: beta
order: 4
---

[Tidewave](https://tidewave.ai/) is an example of a MCP server that runs inside your application. It currently is available for Phoenix and Rails.

Phoenix installation:

```elixir
# mix.exs
{:tidewave, "~> 0.1", only: :dev}

# lib/my_app_web/endpoint.ex
# just above the `if code_reloading? do` block
if Code.ensure_loaded?(Tidewave) do
  plug Tidewave
end
```

Rails installation:
```ruby
gem "tidewave", group: :development
```

Example `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "tidewave": {
      "url": "http://localhost:4000/tidewave/mcp"
    }
  }
}
```

For Claude and others, they recommend an [mcp-proxy](https://github.com/sparfenyuk/mcp-proxy?tab=readme-ov-file#1-stdio-to-sse).

