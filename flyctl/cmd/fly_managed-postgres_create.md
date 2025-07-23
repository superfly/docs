Create a new Managed Postgres cluster


## Usage
~~~
fly managed-postgres create [flags]
~~~

## Options

~~~
  -h, --help              help for create
  -n, --name string       The name of your Postgres cluster
  -o, --org string        The target Fly.io organization
      --pgvector          Enable PGVector for the Postgres cluster
      --plan string       The plan to use for the Postgres cluster (development, production, etc)
      --postgis           Enable PostGIS for the Postgres cluster
  -r, --region string     The target region (see 'flyctl platform regions')
      --volume-size int   The volume size in GB (default 10)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly managed-postgres](/docs/flyctl/managed-postgres/)	 - Manage Managed Postgres clusters.

