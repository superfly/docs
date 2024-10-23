Add, manage, and discharge third-party tokens for a Fly.io API token.
The token to be manipulated may either be passed in the -t argument or in FLY_API_TOKEN.
Third-party caveats rely on a secret shared with between the third party and the
author of the caveat. Pass this secret with --secret, --secret-file, or through the
TOKEN_3P_SHARED_SECRET variable.


## Usage
~~~
fly tokens 3p [command] [flags]
~~~

## Available Commands
* [add](/docs/flyctl/tokens-3p-add/)	 - Add a third-party caveat
* [add-discharge](/docs/flyctl/tokens-3p-add-discharge/)	 - Tack a discharge token onto a Fly.io API token
* [discharge](/docs/flyctl/tokens-3p-discharge/)	 - Exchange a ticket for the token that discharges a third-party caveat
* [ticket](/docs/flyctl/tokens-3p-ticket/)	 - Retrieve the ticket from an existing third-party caveat

## Options

~~~
  -h, --help   help for 3p
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly tokens](/docs/flyctl/tokens/)	 - Manage Fly.io API tokens

