Destroy a managed Postgres cluster. This command will permanently destroy a managed Postgres cluster and all its data.
This action is not reversible.

## Usage
~~~
fly managed-postgres destroy <CLUSTER ID> [flags]
~~~

## Options

~~~
  -h, --help   help for destroy
  -y, --yes    Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly managed-postgres](/docs/flyctl/managed-postgres/)	 - Manage Managed Postgres clusters.

