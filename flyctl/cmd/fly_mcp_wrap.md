[experimental] Wrap an MCP stdio program. Options passed after double dashes ("--") will be passed to the MCP program.


## Usage
~~~
fly mcp wrap [flags]
~~~

## Options

~~~
  -h, --help              help for wrap
  -m, --mcp string        Path to the MCP program
      --password string   [optional] Password to authenticate with
  -p, --port int          Port to listen on (default 8080)
      --user string       [optional] User to authenticate with
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mcp](/docs/flyctl/mcp/)	 - flyctl Model Content Protocol.

