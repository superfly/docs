Create an API token limited to a single LiteFS Cloud cluster.

## Usage
~~~
fly tokens create litefs-cloud [flags]
~~~

## Options

~~~
  -c, --cluster string    Cluster name
  -x, --expiry duration   The duration that the token will be valid (default 175200h0m0s)
  -h, --help              help for litefs-cloud
  -j, --json              JSON output
  -n, --name string       Token name (default "LiteFS Cloud token")
  -o, --org string        The target Fly.io organization
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens create](/docs/flyctl/tokens-create/)	 - Create Fly.io API tokens

