Failover to a new primary


## Usage
~~~
fly postgres failover [flags]
~~~

## Options

~~~
      --allow-secondary-region   Allow failover to a machine in a secondary region. This is useful when the primary region is unavailable, but the secondary region is still healthy. This is only available for flex machines.
  -a, --app string               Application name
  -c, --config string            Path to application configuration file
      --force                    Force a failover even if we can't connect to the active leader
  -h, --help                     help for failover
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

