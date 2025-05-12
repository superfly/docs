[experimental] Start an MCP proxy client


## Usage
~~~
fly mcp proxy [flags]
~~~

## Options

~~~
  -a, --app string            Application name
      --bearer-token string   Bearer token to authenticate with
  -b, --bind-addr string      Local address to bind to (default "127.0.0.1")
  -h, --help                  help for proxy
  -i, --inspector             Launch MCP inspector: a developer tool for testing and debugging MCP servers
  -p, --password string       Password to authenticate with
      --url string            URL of the MCP wrapper server
  -u, --user string           User to authenticate with
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

