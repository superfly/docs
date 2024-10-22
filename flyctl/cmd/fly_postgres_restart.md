Restarts each member of the Postgres cluster one by one. Downtime should be minimal.


## Usage
~~~
fly postgres restart [flags]
~~~

## Options

~~~
  -a, --app string           Application name
  -c, --config string        Path to application configuration file
      --force                Force a restart even we don't have an active leader
  -h, --help                 help for restart
      --skip-health-checks   Runs rolling restart process without waiting for health checks.
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

