Create an API token limited to WireGuard peer management for an organization. Tokens are valid for 20 years by default. We recommend using a shorter expiry if practical.

## Usage
~~~
fly tokens create wireguard [flags]
~~~

## Options

~~~
  -x, --expiry duration   The duration that the token will be valid (default 175200h0m0s)
  -h, --help              help for wireguard
  -j, --json              JSON output
  -n, --name string       Token name (default "WireGuard token")
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

