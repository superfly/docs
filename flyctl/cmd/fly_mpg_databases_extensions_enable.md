Enable a Postgres extension on a database in a Managed Postgres cluster.

## Usage
~~~
fly mpg databases extensions enable <EXTENSION> [flags]
~~~

## Options

~~~
  -c, --cluster string    Target cluster ID
      --create-schema     Create the schema if it does not exist
  -d, --database string   Target database within the cluster
  -h, --help              help for enable
      --schema string     Schema in which to create the extension (default: public)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mpg databases extensions](/docs/flyctl/mpg-databases-extensions/)	 - Manage Postgres extensions in a managed postgres cluster database

