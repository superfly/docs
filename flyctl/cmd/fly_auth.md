Authenticate with Fly (and logout if you need to).
If you do not have an account, start with the AUTH SIGNUP command.
If you do have an account, begin with the AUTH LOGIN subcommand.


## Usage
~~~
fly auth [command] [flags]
~~~

## Available Commands
* [docker](/docs/flyctl/fly-auth-docker/)	 - Authenticate docker
* [login](/docs/flyctl/fly-auth-login/)	 - Log in a user
* [logout](/docs/flyctl/fly-auth-logout/)	 - Logs out the currently logged in user
* [signup](/docs/flyctl/fly-auth-signup/)	 - Create a new fly account
* [token](/docs/flyctl/fly-auth-token/)	 - Show the current auth token
* [whoami](/docs/flyctl/fly-auth-whoami/)	 - Displays the users email address/service identity currently
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

* [fly](/docs/flyctl/fly/)	 - The Fly.io command line interface

