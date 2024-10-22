Create an API token that can execute a restricted set of commands on a machine. Commands can be specified on the command line or with the command and command-prefix flags. If no command is provided, all commands are allowed. Tokens are valid for 20 years by default. We recommend using a shorter expiry if practical.

## Usage
~~~
fly tokens create machine-exec [command...] [flags]
~~~

## Options

~~~
  -a, --app string               Application name
  -C, --command strings          An allowed command with arguments. This command must match exactly
  -p, --command-prefix strings   An allowed command with arguments. This command must match the prefix of a command
  -c, --config string            Path to application configuration file
  -x, --expiry duration          The duration that the token will be valid (default 175200h0m0s)
  -h, --help                     help for machine-exec
  -j, --json                     JSON output
  -n, --name string              Token name (default "flyctl machine-exec token")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens create](/docs/flyctl/tokens-create/)	 - Create Fly.io API tokens

