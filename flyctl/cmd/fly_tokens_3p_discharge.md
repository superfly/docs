Given the ticket for a third-party caveat, generate the discharge token
that satisfies the caveat.

## Usage
~~~
fly tokens 3p discharge [flags]
~~~

## Options

~~~
  -h, --help                 help for discharge
  -l, --location string      URL identifying third-party service
  -S, --secret string        (insecure) base64 shared secret for third-party caveat
  -s, --secret-file string   file containing base64 shared secret for third-party caveat
      --ticket string        Third party caveat ticket
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens 3p](/docs/flyctl/tokens-3p/)	 - Manage third-party (3P) caveats for Fly.io API tokens

