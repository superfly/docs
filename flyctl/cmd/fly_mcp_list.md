[experimental] List MCP servers


## Usage
~~~
fly mcp list [flags]
~~~

## Options

~~~
  -a, --app string           Application name
      --claude               List MCP servers from the Claude client configuration
      --config stringArray   Path to the MCP client configuration file (can be specified multiple times)
      --cursor               List MCP servers from the Cursor client configuration
  -h, --help                 help for list
      --json                 Output in JSON format
      --neovim               List MCP servers from the Neovim client configuration
      --vscode               List MCP servers from the VS Code client configuration
      --windsurf             List MCP servers from the Windsurf client configuration
      --zed                  List MCP servers from the Zed client configuration
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

