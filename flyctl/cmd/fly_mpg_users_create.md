Create a new user in a Managed Postgres cluster.

## Usage
~~~
fly mpg users create <CLUSTER_ID> [flags]
~~~

## Options

~~~
  -h, --help              help for create
  -r, --role string       The role of the user (schema_admin, writer, or reader)
  -u, --username string   The username of the user
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mpg users](/docs/flyctl/mpg-users/)	 - Manage users in a managed postgres cluster

