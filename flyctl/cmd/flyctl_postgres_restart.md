Restarts each member of the Postgres cluster one by one. Downtime should be minimal.


## Usage
~~~
flyctl postgres restart [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -f, --force           Force a restart even we don't have an active leader
  -h, --help            help for restart
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

