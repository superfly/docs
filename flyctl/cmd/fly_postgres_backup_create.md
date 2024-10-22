Create a backup


## Usage
~~~
fly postgres backup create [flags]
~~~

## Options

~~~
  -a, --app string             Application name
  -c, --config string          Path to application configuration file
  -h, --help                   help for create
  -i, --immediate-checkpoint   Forces Postgres to perform an immediate checkpoint
  -n, --name string            Backup name
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly postgres backup](/docs/flyctl/postgres-backup/)	 - Backup commands

