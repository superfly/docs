[experimental] Add MCP proxy client to a MCP client configuration


## Usage
~~~
fly mcp add [flags]
~~~

## Options

~~~
  -a, --app string           Application name
      --bearer-token         Use bearer token for authentication (default true)
      --claude               Add MCP server to the Claude client configuration
      --config stringArray   Path to the MCP client configuration file (can be specified multiple times)
      --cursor               Add MCP server to the Cursor client configuration
      --flycast              Use wireguard and flycast for access
  -h, --help                 help for add
      --name string          Name to use for the MCP server in the MCP client configuration
      --neovim               Add MCP server to the Neovim client configuration
      --password string      Password to authenticate with
      --url string           URL of the MCP wrapper server
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

