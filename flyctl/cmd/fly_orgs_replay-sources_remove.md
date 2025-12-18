Remove organizations from the list of allowed replay sources for this organization.

If no slugs are provided, an interactive selector will be shown.

## Usage
~~~
fly orgs replay-sources remove [<slug>...] [flags]
~~~

## Options

~~~
  -h, --help         help for remove
  -o, --org string   The target Fly.io organization
  -y, --yes          Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly orgs replay-sources](/docs/flyctl/orgs-replay-sources/)	 - Manage allowed replay source organizations

