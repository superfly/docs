[experimental] Launch an MCP stdio program. Options passed after double dashes ("--") will be passed to the MCP program. If user is specified, HTTP authentication will be required.


## Usage
~~~
fly mcp launch [flags]
~~~

## Options

~~~
      --bearer-token      Use bearer token for authentication (default true)
      --claude            Add MCP server to the Claude client configuration
      --cursor            Add MCP server to the Cursor client configuration
      --flycast           Use wireguard and flycast for access
  -h, --help              help for launch
      --name string       Name to use for the MCP server in the MCP client configuration
      --neovim            Add MCP server to the Neovim client configuration
      --password string   Password to authenticate with
      --user string       User to authenticate with
      --vscode            Add MCP server to the VS Code client configuration
      --windsurf          Add MCP server to the Windsurf client configuration
      --zed               Add MCP server to the Zed client configuration
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

