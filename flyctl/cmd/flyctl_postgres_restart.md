Restarts each member of the Postgres cluster one by one. Downtime should be minimal.


## Usage
~~~
flyctl postgres restart [flags]
~~~

## Options

~~~
  -a, --app string           Application name
  -c, --config string        Path to application configuration file
      --force                Force a restart even we don't have an active leader
  -h, --help                 help for restart
      --skip-health-checks   Runs rolling restart process without waiting for health checks. ( Machines only )
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

