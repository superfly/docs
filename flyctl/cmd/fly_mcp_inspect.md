[experimental] Inspect a MCP stdio server


## Usage
~~~
fly mcp inspect [flags]
~~~

## Options

~~~
  -a, --app string            Application name
      --bearer-token string   Bearer token to authenticate with
  -b, --bind-addr string      Local address to bind to (default "127.0.0.1")
      --claude                Use the configuration for Claude client
      --config string         Path to the MCP client configuration file
      --cursor                Use the configuration for Cursor client
  -h, --help                  help for inspect
      --neovim                Use the configuration for Neovim client
  -p, --password string       Password to authenticate with
      --server string         Name of the MCP server in the MCP client configuration
      --url string            URL of the MCP wrapper server
  -u, --user string           User to authenticate with
      --vscode                Use the configuration for VS Code client
      --windsurf              Use the configuration for Windsurf client
      --zed                   Use the configuration for Zed client
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

