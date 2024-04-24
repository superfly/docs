Create token for SSH'ing to a single app. To be able to SSH to an app, this token is also allowed to connect to the org's wireguard network.

## Usage
~~~
fly tokens create ssh [flags]
~~~

## Options

~~~
  -a, --app string        Application name
  -c, --config string     Path to application configuration file
  -x, --expiry duration   The duration that the token will be valid (default 175200h0m0s)
  -h, --help              help for ssh
  -j, --json              JSON output
  -n, --name string       Token name (default "flyctl ssh token")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens create](/docs/flyctl/tokens-create/)	 - Create Fly.io API tokens

