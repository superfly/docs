Shows the authentication token that is currently in use by flyctl.
The auth token used by flyctl may expire quickly and shouldn't be used in places
where the token needs to keep working for a long time. For API authentication, you
can use the "fly tokens create" command instead, to create narrowly-scoped tokens with
a custom expiry.

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

