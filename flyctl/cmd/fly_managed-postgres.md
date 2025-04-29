Manage Managed Postgres clusters.


## Usage
~~~
fly managed-postgres [command] [flags]
~~~

## Available Commands
* [attach](/docs/flyctl/managed-postgres-attach/)	 - Attach a managed Postgres cluster to an app
* [connect](/docs/flyctl/managed-postgres-connect/)	 - Connect to a MPG database using psql
* [create](/docs/flyctl/managed-postgres-create/)	 - Create a new Managed Postgres cluster
* [list](/docs/flyctl/managed-postgres-list/)	 - List MPG clusters.
* [proxy](/docs/flyctl/managed-postgres-proxy/)	 - Proxy to a MPG database
* [status](/docs/flyctl/managed-postgres-status/)	 - Show MPG cluster status.

## Options

~~~
  -h, --help         help for managed-postgres
  -o, --org string   The target Fly.io organization
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

