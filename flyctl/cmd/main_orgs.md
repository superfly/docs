Commands for managing Fly organizations. list, create, show and
destroy organizations.
Organization admins can also invite or remove users from Organizations.


## Usage
~~~
main orgs [command] [flags]
~~~

## Available Commands
* [create](/docs/flyctl/main-orgs-create/)	 - Create an organization
* [delete](/docs/flyctl/main-orgs-delete/)	 - Delete an organization
* [invite](/docs/flyctl/main-orgs-invite/)	 - Invite user (by email) to organization
* [list](/docs/flyctl/main-orgs-list/)	 - Lists organizations for current user
* [remove](/docs/flyctl/main-orgs-remove/)	 - Remove a user from an organization
* [show](/docs/flyctl/main-orgs-show/)	 - Show information about an organization

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

* [main](/docs/flyctl/main/)	 - The Fly.io command line interface

