Proxies connections to a Fly Machine through a WireGuard tunnel. By default,
connects to the first Machine address returned by an internal DNS query on the app.

## Usage
~~~
fly proxy <local:remote> [remote_host] [flags]
~~~

## Options

~~~
  -a, --app string         Application name
  -b, --bind-addr string   Local address to bind to (default "127.0.0.1")
  -c, --config string      Path to application configuration file
  -h, --help               help for proxy
  -o, --org string         The target Fly.io organization
  -q, --quiet              Don't print progress indicators for WireGuard
  -s, --select             Prompt to select from available Machines from the current application
      --watch-stdin        Watches stdin and terminates once it gets closed
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

