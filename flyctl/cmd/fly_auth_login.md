Logs a user into the Fly platform. Supports browser-based,
email/password and one-time-password authentication. Defaults to using
browser-based authentication.


## Usage
~~~
fly auth login [flags]
~~~

## Options

~~~
      --email string      Login email
  -h, --help              help for login
  -i, --interactive       Log in with an email and password interactively
      --otp string        One time password
      --password string   Login password
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly auth](/docs/flyctl/auth/)	 - Manage authentication

