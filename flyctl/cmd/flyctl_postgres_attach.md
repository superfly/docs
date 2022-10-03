Attach a postgres cluster to an app


## Usage
~~~
flyctl postgres attach [POSTGRES APP] [flags]
~~~

## Options

~~~
  -a, --app string             Application name
  -c, --config string          Path to application configuration file
      --database-name string   The designated database name for this consuming app.
      --database-user string   The database user to create. By default, we will use the name of the consuming app.
      --force                  Force attach (bypass confirmation)
  -h, --help                   help for attach
      --variable-name string   The environment variable name that will be added to the consuming app.  (default "DATABASE_URL")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

