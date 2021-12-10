<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Commands for managing Fly organizations
</p>

## About

Commands for managing Fly organizations. list, create, show and
destroy organizations.
Organization admins can also invite or remove users from Organizations.

## Usage

~~~
flyctl orgs [command] [flags]
~~~

### Available Commands
* [create](/docs/flyctl/orgs-create/)	 - Create an organization
* [delete](/docs/flyctl/orgs-delete/)	 - Delete an organization
* [invite](/docs/flyctl/orgs-invite/)	 - Invite user (by email) to organization
* [list](/docs/flyctl/orgs-list/)	 - Lists organizations for current user
* [remove](/docs/flyctl/orgs-remove/)	 - Remove a user from an organization
* [revoke](/docs/flyctl/orgs-revoke/)	 - Revoke a pending invitation to an organization
* [show](/docs/flyctl/orgs-show/)	 - Show information about an organization

## Options

~~~
  -h, --help   help for orgs
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

