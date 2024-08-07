Shows the authentication token that is currently in use by flyctl.

This can be used as an authentication token with API services. These tokens may expire quickly and shouldn't be used in places where the token needs to keep working for a long time. Use `fly tokens create` instead for creating narrowly scoped tokens that can have a custom expiry.


## Usage
~~~
fly auth token [flags]
~~~

## Options

~~~
  -h, --help   help for token
  -j, --json   JSON output
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly auth](/docs/flyctl/auth/)	 - Manage authentication
