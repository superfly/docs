Manage Postgres clusters.


## Usage
~~~
fly postgres [command] [flags]
~~~

## Available Commands
* [attach](/docs/flyctl/fly-postgres-attach/)	 - Attach a postgres cluster to an app
* [barman](/docs/flyctl/fly-postgres-barman/)	 - Manage databases in a cluster
* [config](/docs/flyctl/fly-postgres-config/)	 - Show and manage Postgres configuration.
* [connect](/docs/flyctl/fly-postgres-connect/)	 - Connect to the Postgres console
* [create](/docs/flyctl/fly-postgres-create/)	 - Create a new Postgres cluster
* [db](/docs/flyctl/fly-postgres-db/)	 - Manage databases in a cluster
* [detach](/docs/flyctl/fly-postgres-detach/)	 - Detach a postgres cluster from an app
* [events](/docs/flyctl/fly-postgres-events/)	 - Track major cluster events
* [failover](/docs/flyctl/fly-postgres-failover/)	 - Failover to a new primary
* [import](/docs/flyctl/fly-postgres-import/)	 - Imports database from a specified Postgres URI
* [list](/docs/flyctl/fly-postgres-list/)	 - List postgres clusters
* [restart](/docs/flyctl/fly-postgres-restart/)	 - Restarts each member of the Postgres cluster one by one.
* [users](/docs/flyctl/fly-postgres-users/)	 - Manage users in a postgres cluster

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

* [fly](/docs/flyctl/fly/)	 - The Fly.io command line interface

