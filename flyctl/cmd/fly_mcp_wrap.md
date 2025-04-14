[experimental] Wrap an MCP stdio program. Options passed after double dashes ("--") will be passed to the MCP program. If user is specified, HTTP authentication will be required.


## Usage
~~~
fly mcp wrap [flags]
~~~

## Options

~~~
  -h, --help              help for wrap
  -m, --mcp string        [required] Path to the stdio MCP program to be wrapped.
      --password string   [optional] Password to authenticate with. Defaults to the value of the FLY_MCP_PASSWORD environment variable.
  -p, --port int          [optional] Port to listen on.  Defaults to 8080. (default 8080)
      --user string       [optional] User to authenticate with. Defaults to the value of the FLY_MCP_USER environment variable.
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Context Protocol.

