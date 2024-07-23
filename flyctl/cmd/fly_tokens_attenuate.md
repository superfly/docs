Attenuate a Fly.io API token by appending caveats to it. The
				token to be attenuated may either be passed in the -t argument
				or in FLY_API_TOKEN. Caveats must be JSON encoded. See
				https://github.com/superfly/macaroon for details on
				macaroons and caveats.

## Usage
~~~
fly tokens attenuate [flags]
~~~

## Options

~~~
  -f, --file string   Filename to read caveats from. Defaults to stdin
  -h, --help          help for attenuate
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens](/docs/flyctl/tokens/)	 - Manage Fly.io API tokens

