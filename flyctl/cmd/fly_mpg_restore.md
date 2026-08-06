Restore a Managed Postgres backup into a new cluster, leaving the source
cluster unchanged. The restored cluster is provisioned asynchronously in the
same organization and billed separately.

Find backup IDs with 'fly mpg backup list'.

## Usage
~~~
fly mpg restore <CLUSTER_ID> [flags]
~~~

## Options

~~~
      --backup-id string   The backup ID to restore from
  -h, --help               help for restore
  -n, --name string        The name of the restored cluster (defaults to a generated name)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mpg](/docs/flyctl/mpg/)	 - Manage Managed Postgres clusters.

