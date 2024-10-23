Manage Postgres clusters.


## Usage
~~~
main postgres [command] [flags]
~~~

## Available Commands
* [attach](/docs/flyctl/main-postgres-attach/)	 - Attach a postgres cluster to an app
* [backup](/docs/flyctl/main-postgres-backup/)	 - Backup commands
* [config](/docs/flyctl/main-postgres-config/)	 - Show and manage Postgres configuration.
* [connect](/docs/flyctl/main-postgres-connect/)	 - Connect to the Postgres console
* [create](/docs/flyctl/main-postgres-create/)	 - Create a new Postgres cluster
* [db](/docs/flyctl/main-postgres-db/)	 - Manage databases in a cluster
* [detach](/docs/flyctl/main-postgres-detach/)	 - Detach a postgres cluster from an app
* [events](/docs/flyctl/main-postgres-events/)	 - Track major cluster events
* [failover](/docs/flyctl/main-postgres-failover/)	 - Failover to a new primary
* [import](/docs/flyctl/main-postgres-import/)	 - Imports database from a specified Postgres URI
* [list](/docs/flyctl/main-postgres-list/)	 - List postgres clusters
* [renew-certs](/docs/flyctl/main-postgres-renew-certs/)	 - Renews the SSH certificates for the Postgres cluster.
* [restart](/docs/flyctl/main-postgres-restart/)	 - Restarts each member of the Postgres cluster one by one.
* [users](/docs/flyctl/main-postgres-users/)	 - Manage users in a postgres cluster

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

* [main](/docs/flyctl/main/)	 - The Fly.io command line interface

