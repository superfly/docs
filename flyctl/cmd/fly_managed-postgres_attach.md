Attach a managed Postgres cluster to an app. This command will add a secret to the specified app
 containing the connection string for the database.

## Usage
~~~
fly managed-postgres attach <CLUSTER ID> [flags]
~~~

## Options

~~~
  -a, --app string             Application name
  -c, --config string          Path to application configuration file
  -h, --help                   help for attach
      --variable-name string   The name of the environment variable that will be added to the attached app (default "DATABASE_URL")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly managed-postgres](/docs/flyctl/managed-postgres/)	 - Manage Managed Postgres clusters.

