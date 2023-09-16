Proxies connections to a Fly VM through a WireGuard tunnel The current application DNS is the default remote host

## Usage
~~~
flyctl proxy <local:remote> [remote_host] [flags]
~~~

## Options

~~~
  -a, --app string         Application name
  -b, --bind-addr string   Local address to bind to (default "127.0.0.1")
  -c, --config string      Path to application configuration file
  -h, --help               help for proxy
  -o, --org string         The target Fly organization
  -q, --quiet              Don't print progress indicators for WireGuard
  -s, --select             Prompt to select from available instances from the current application
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly.io command line interface

