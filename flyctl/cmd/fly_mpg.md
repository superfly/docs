Manage Managed Postgres clusters.


## Usage
~~~
fly mpg [command] [flags]
~~~

## Available Commands
* [attach](/docs/flyctl/mpg-attach/)	 - Attach a managed Postgres cluster to an app
* [backup](/docs/flyctl/mpg-backup/)	 - Backup commands
* [connect](/docs/flyctl/mpg-connect/)	 - Connect to a MPG database using psql
* [create](/docs/flyctl/mpg-create/)	 - Create a new Managed Postgres cluster
* [databases](/docs/flyctl/mpg-databases/)	 - Manage databases in a managed postgres cluster
* [destroy](/docs/flyctl/mpg-destroy/)	 - Destroy a managed Postgres cluster
* [list](/docs/flyctl/mpg-list/)	 - List MPG clusters.
* [proxy](/docs/flyctl/mpg-proxy/)	 - Proxy to a MPG database
* [restore](/docs/flyctl/mpg-restore/)	 - Restore MPG cluster from backup.
* [status](/docs/flyctl/mpg-status/)	 - Show MPG cluster status.
* [users](/docs/flyctl/mpg-users/)	 - Manage users in a managed postgres cluster

## Options

~~~
  -h, --help         help for mpg
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

