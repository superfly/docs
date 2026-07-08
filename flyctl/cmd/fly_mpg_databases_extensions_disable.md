Disable a Postgres extension on a database in a Managed Postgres cluster.

## Usage
~~~
fly mpg databases extensions disable <EXTENSION> [flags]
~~~

## Options

~~~
  -c, --cluster string    Target cluster ID
  -d, --database string   Target database within the cluster
      --force             Drop dependent objects as well (CASCADE)
  -h, --help              help for disable
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mpg databases extensions](/docs/flyctl/mpg-databases-extensions/)	 - Manage Postgres extensions in a managed postgres cluster database

