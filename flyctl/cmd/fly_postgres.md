Manage Postgres clusters.


## Usage
~~~
fly postgres [command] [flags]
~~~

## Available Commands
* [attach](/docs/flyctl/postgres-attach/)	 - Attach a postgres cluster to an app
* [backup](/docs/flyctl/postgres-backup/)	 - Backup commands
* [config](/docs/flyctl/postgres-config/)	 - Show and manage Postgres configuration.
* [connect](/docs/flyctl/postgres-connect/)	 - Connect to the Postgres console
* [create](/docs/flyctl/postgres-create/)	 - Create a new Postgres cluster
* [db](/docs/flyctl/postgres-db/)	 - Manage databases in a cluster
* [detach](/docs/flyctl/postgres-detach/)	 - Detach a postgres cluster from an app
* [events](/docs/flyctl/postgres-events/)	 - Track major cluster events
* [failover](/docs/flyctl/postgres-failover/)	 - Failover to a new primary
* [import](/docs/flyctl/postgres-import/)	 - Imports database from a specified Postgres URI
* [list](/docs/flyctl/postgres-list/)	 - List postgres clusters
* [renew-certs](/docs/flyctl/postgres-renew-certs/)	 - Renews the SSH certificates for the Postgres cluster.
* [restart](/docs/flyctl/postgres-restart/)	 - Restarts each member of the Postgres cluster one by one.
* [users](/docs/flyctl/postgres-users/)	 - Manage users in a postgres cluster

## Options

~~~
  -h, --help   help for postgres
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

