If a third-party caveat tied to the URL at --location is present in
the Fly.io API token, retrieve its ticket, so it can be submitted to the service
to retrieve a discharge token.

## Usage
~~~
fly tokens 3p ticket [flags]
~~~

## Options

~~~
  -h, --help              help for ticket
  -l, --location string   URL identifying third-party service
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens 3p](/docs/flyctl/tokens-3p/)	 - Manage third-party (3P) caveats for Fly.io API tokens

