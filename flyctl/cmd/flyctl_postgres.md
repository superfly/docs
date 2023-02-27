Manage Postgres clusters.


## Usage
~~~
flyctl postgres [command] [flags]
~~~

## Available Commands
* [attach](/docs/flyctl/postgres-attach/)	 - Attach a postgres cluster to an app
* [config](/docs/flyctl/postgres-config/)	 - Show and manage Postgres configuration.
* [connect](/docs/flyctl/postgres-connect/)	 - Connect to the Postgres console
* [create](/docs/flyctl/postgres-create/)	 - Create a new PostgreSQL cluster
* [db](/docs/flyctl/postgres-db/)	 - Manage databases in a cluster
* [detach](/docs/flyctl/postgres-detach/)	 - Detach a postgres cluster from an app
* [failover](/docs/flyctl/postgres-failover/)	 - Failover to a new primary
* [import](/docs/flyctl/postgres-import/)	 - Imports database from a specified Postgres URI
* [list](/docs/flyctl/postgres-list/)	 - List postgres clusters
* [restart](/docs/flyctl/postgres-restart/)	 - Restarts each member of the Postgres cluster one by one.
* [users](/docs/flyctl/postgres-users/)	 - Manage users in a postgres cluster

## Options

~~~
  -h, --help   help for postgres
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

