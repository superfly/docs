[experimental] Launch an MCP stdio server


## Usage
~~~
fly mcp launch command [flags]
~~~

## Options

~~~
      --auto-stop string     Automatically suspend the app after a period of inactivity. Valid values are 'off', 'stop', and 'suspend (default "stop")
      --bearer-token         Use bearer token for authentication (default true)
      --claude               Add MCP server to the Claude client configuration
      --config stringArray   Path to the MCP client configuration file (can be specified multiple times)
      --cursor               Add MCP server to the Cursor client configuration
      --flycast              Use wireguard and flycast for access
  -h, --help                 help for launch
  -i, --inspector            Launch MCP inspector: a developer tool for testing and debugging MCP servers
      --name string          Name to use for the MCP server in the MCP client configuration
      --neovim               Add MCP server to the Neovim client configuration
      --password string      Password to authenticate with
      --user string          User to authenticate with
      --vscode               Add MCP server to the VS Code client configuration
      --windsurf             Add MCP server to the Windsurf client configuration
      --zed                  Add MCP server to the Zed client configuration
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

