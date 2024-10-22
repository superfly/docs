Commands for managing Fly organizations. list, create, show and
destroy organizations.
Organization admins can also invite or remove users from Organizations.


## Usage
~~~
fly orgs [command] [flags]
~~~

## Available Commands
* [create](/docs/flyctl/orgs-create/)	 - Create an organization
* [delete](/docs/flyctl/orgs-delete/)	 - Delete an organization
* [invite](/docs/flyctl/orgs-invite/)	 - Invite user (by email) to organization
* [list](/docs/flyctl/orgs-list/)	 - Lists organizations for current user
* [remove](/docs/flyctl/orgs-remove/)	 - Remove a user from an organization
* [show](/docs/flyctl/orgs-show/)	 - Show information about an organization

## Options

~~~
  -h, --help   help for orgs
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

