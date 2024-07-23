Decode and print a Fly.io API token. The token to be
				debugged may either be passed in the -t argument or in FLY_API_TOKEN.
				See https://github.com/superfly/macaroon for details Fly.io macaroon
				tokens.

## Usage
~~~
fly tokens debug [flags]
~~~

## Options

~~~
  -f, --file string   Filename to read caveats from. Defaults to stdin
  -h, --help          help for debug
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens](/docs/flyctl/tokens/)	 - Manage Fly.io API tokens

