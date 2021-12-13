Make DNS requests against Fly.io's internal DNS server. Valid types include AAAA and TXT (the two types our servers answer authoritatively), AAAA-NATIVE and TXT-NATIVE, which resolve with Go's resolver (they're slower, but may be useful if diagnosing a DNS bug) and A and CNAME (if you're using the server to test recursive lookups.) Note that this resolves names against the server for the current organization. You can set the organization with `-o <org-slug>` otherwise, the command uses the organization attached to the current app (you can pass an app in with `-a <appname>`).

## Usage

~~~
flyctl dig [type] <name> [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for dig
  -o, --org string      Select organization for DNS lookups instead of current app
  -s, --short           Just print the answers, not DNS record details
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

