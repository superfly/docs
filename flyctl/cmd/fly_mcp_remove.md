[experimental] Remove MCP proxy client from a MCP client configuration


## Usage
~~~
fly mcp remove [flags]
~~~

## Options

~~~
  -a, --app string           Application name
      --claude               Remove MCP server from the Claude client configuration
      --config stringArray   Path to the MCP client configuration file (can be specified multiple times)
      --cursor               Remove MCP server from the Cursor client configuration
  -h, --help                 help for remove
      --neovim               Remove MCP server from the Neovim client configuration
      --server string        Name to use for the MCP server in the MCP client configuration
      --vscode               Remove MCP server from the VS Code client configuration
      --windsurf             Remove MCP server from the Windsurf client configuration
      --zed                  Remove MCP server from the Zed client configuration
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

