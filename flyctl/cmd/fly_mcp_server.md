[experimental] Start a flyctl MCP server


## Usage
~~~
fly mcp server [flags]
~~~

## Options

~~~
      --claude               Add flyctl MCP server to the Claude client configuration
      --config stringArray   Path to the MCP client configuration file (can be specified multiple times)
      --cursor               Add flyctl MCP server to the Cursor client configuration
  -h, --help                 help for server
  -i, --inspector            Launch MCP inspector: a developer tool for testing and debugging MCP servers
      --neovim               Add flyctl MCP server to the Neovim client configuration
      --server string        Name to use for the MCP server in the MCP client configuration
      --vscode               Add flyctl MCP server to the VS Code client configuration
      --windsurf             Add flyctl MCP server to the Windsurf client configuration
      --zed                  Add flyctl MCP server to the Zed client configuration
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

