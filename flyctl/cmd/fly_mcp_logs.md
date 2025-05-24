[experimental] Show log for an MCP server


## Usage
~~~
fly mcp logs [flags]
~~~

## Options

~~~
  -a, --app string           Application name
      --claude               Select MCP server from the Claude client configuration
      --config stringArray   Path to the MCP client configuration file (can be specified multiple times)
      --cursor               Select MCP server from the Cursor client configuration
  -h, --help                 help for logs
      --json                 Output in JSON format
      --neovim               Select MCP server from the Neovim client configuration
  -n, --no-tail              Do not continually stream logs
      --server string        Name of the MCP server to show logs for
      --vscode               Select MCP server from the VS Code client configuration
      --windsurf             Select MCP server from the Windsurf client configuration
      --zed                  Select MCP server from the Zed client configuration
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

