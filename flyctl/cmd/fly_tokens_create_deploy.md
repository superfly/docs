Create an API token limited to managing a single app and its resources. Also available as TOKENS DEPLOY. Tokens are valid for 20 years by default. We recommend using a shorter expiry if practical.

## Usage
~~~
fly tokens create deploy [flags]
~~~

## Options

~~~
  -a, --app string        Application name
  -c, --config string     Path to application configuration file
  -x, --expiry duration   The duration that the token will be valid (default 175200h0m0s)
  -h, --help              help for deploy
  -j, --json              JSON output
  -n, --name string       Token name (default "flyctl deploy token")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens create](/docs/flyctl/tokens-create/)	 - Create Fly.io API tokens

