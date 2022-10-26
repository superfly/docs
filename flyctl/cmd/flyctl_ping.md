Test connectivity with ICMP ping messages.

This runs over WireGuard; tell us which WireGuard tunnel to use by
running from within an app directory (with a 'fly.toml'), passing the
'-a' flag with an app name, or the '-o' flag with an org name.

With no arguments, test connectivity to your gateway, the first hop
in our network, to see if your WireGuard connection is working.

The target argument can be either a ".internal" DNS name in our network
(the name of your application) or "gateway".

## Usage
~~~
flyctl ping [hostname] [flags]
~~~

## Options

~~~
  -a, --app string        Application name
  -c, --config string     Path to application configuration file
  -n, --count int         Number of probes to send (0=indefinite)
  -h, --help              help for ping
  -i, --interval string   Interval between ping probes (default "1s")
  -o, --org string        The target Fly organization
  -s, --size int          Size of probe to send (not including headers) (default 12)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

