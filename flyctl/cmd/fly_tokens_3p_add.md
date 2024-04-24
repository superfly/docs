Add a caveat to the Fly.io token that requires a third-party service,
identified by --location (a URL), to supply a discharge token in order to clear.


## Usage
~~~
fly tokens 3p add [flags]
~~~

## Options

~~~
  -h, --help                 help for add
  -l, --location string      URL identifying third-party service
  -S, --secret string        (insecure) base64 shared secret for third-party caveat
  -s, --secret-file string   file containing base64 shared secret for third-party caveat
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens 3p](/docs/flyctl/tokens-3p/)	 - Manage third-party (3P) caveats for Fly.io API tokens

