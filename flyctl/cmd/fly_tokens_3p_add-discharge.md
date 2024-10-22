Once obtained by exchanging a caveat ticket with a third-party service,
add the matching discharge token to the Fly.io API token header, to include it with
authentication attempts.

## Usage
~~~
fly tokens 3p add-discharge [flags]
~~~

## Options

~~~
  -d, --discharge string   Third-party discharge token
  -h, --help               help for add-discharge
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens 3p](/docs/flyctl/tokens-3p/)	 - Manage third-party (3P) caveats for Fly.io API tokens

