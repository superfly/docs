# _flyctl auth login_

Log in a user

### About

Logs a user into the Fly platform. Supports browser-based, 
email/password and one-time-password authentication. Defaults to using 
browser-based authentication.


### Usage
~~~
flyctl auth login [flags]
~~~

### Options

~~~
      --email string      Login email
  -h, --help              help for login
  -i, --interactive       Log in with an email and password interactively
      --otp string        One time password
      --password string   Login password
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl auth](/docs/flyctl/auth/)	 - Manage authentication

