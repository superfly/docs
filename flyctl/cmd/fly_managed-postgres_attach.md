Attach a managed postgres cluster to an app


## Usage
~~~
fly managed-postgres attach <CLUSTER ID> [flags]
~~~

## Options

~~~
  -a, --app string             Application name
  -c, --config string          Path to application configuration file
      --database-name string   The designated database name for this consuming app.
      --database-user string   The database user to create. By default, we will use the name of the consuming app.
  -h, --help                   help for attach
      --variable-name string   The environment variable name that will be added to the consuming app.  (default "DATABASE_URL")
  -y, --yes                    Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly managed-postgres](/docs/flyctl/managed-postgres/)	 - Manage Managed Postgres clusters.

