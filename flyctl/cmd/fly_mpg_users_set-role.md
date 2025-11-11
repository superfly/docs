Update a user's role in a Managed Postgres cluster.

## Usage
~~~
fly mpg users set-role <CLUSTER_ID> [flags]
~~~

## Options

~~~
  -h, --help              help for set-role
  -r, --role string       The new role for the user (schema_admin, writer, or reader)
  -u, --username string   The username to update
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mpg users](/docs/flyctl/mpg-users/)	 - Manage users in a managed postgres cluster

