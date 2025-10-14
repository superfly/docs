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
      --instance string       Use fly-force-instance-id to connect to a specific instance
      --neovim                Use the configuration for Neovim client
  -p, --password string       Password to authenticate with
      --ping                  Enable ping for the MCP connection
      --server string         Name of the MCP server in the MCP client configuration
      --sse                   Use Server-Sent Events (SSE) for the MCP connection
      --stream                Use streaming for the MCP connection
      --timeout int           Timeout in seconds for the MCP connection
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

