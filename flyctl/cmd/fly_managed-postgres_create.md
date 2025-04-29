Create a new Managed Postgres cluster


## Usage
~~~
fly managed-postgres create [flags]
~~~

## Options

~~~
      --auto-stop         Automatically stop the cluster when not in use
      --enable-backups    Enable WAL-based backups (default true)
  -h, --help              help for create
  -n, --name string       The name of your Postgres cluster
      --nodes int         Number of nodes in the cluster (default 1)
  -o, --org string        The target Fly.io organization
      --plan string       The plan to use for the Postgres cluster (development, production, etc)
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

