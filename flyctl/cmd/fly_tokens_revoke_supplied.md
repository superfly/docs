Revoke the access token supplied by --access-token, FLY_ACCESS_TOKEN, or
FLY_API_TOKEN, including all tokens in a token bundle. Uses --access-token first,
then FLY_ACCESS_TOKEN, then FLY_API_TOKEN. An explicitly empty FLY_ACCESS_TOKEN
prevents FLY_API_TOKEN from being selected.

Use 'fly auth logout' to revoke the access token saved by 'fly auth login'.

Does not clear local configuration or unset environment variables.

## Usage
~~~
fly tokens revoke supplied [flags]
~~~

## Options

~~~
  -h, --help   help for supplied
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens revoke](/docs/flyctl/tokens-revoke/)	 - Revoke tokens

