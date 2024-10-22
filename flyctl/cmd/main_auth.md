Authenticate with Fly (and logout if you need to).
If you do not have an account, start with the AUTH SIGNUP command.
If you do have an account, begin with the AUTH LOGIN subcommand.


## Usage
~~~
main auth [command] [flags]
~~~

## Available Commands
* [docker](/docs/flyctl/main-auth-docker/)	 - Authenticate docker
* [login](/docs/flyctl/main-auth-login/)	 - Log in a user
* [logout](/docs/flyctl/main-auth-logout/)	 - Logs out the currently logged in user
* [signup](/docs/flyctl/main-auth-signup/)	 - Create a new fly account
* [whoami](/docs/flyctl/main-auth-whoami/)	 - Displays the users email address/service identity currently
authenticated and in use.


## Options

~~~
  -h, --help   help for auth
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [main](/docs/flyctl/main/)	 - The Fly.io command line interface

