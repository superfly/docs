Proxies connections to a fly VM through a Wireguard tunnel The current application DNS is the default remote host

## Usage
~~~
flyctl proxy <local:remote> [remote_host] [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for proxy
  -o, --org string      The organization to operate on
  -q, --quiet           Don't print progress indicators for WireGuard
  -s, --select          Prompt to select from available instances from the current application
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

