Backup commands


## Usage
~~~
main postgres backup [command] [flags]
~~~

## Available Commands
* [config](/docs/flyctl/main-postgres-backup-config/)	 - Manage backup configuration
* [create](/docs/flyctl/main-postgres-backup-create/)	 - Create a backup
* [enable](/docs/flyctl/main-postgres-backup-enable/)	 - Enable backups on a Postgres cluster, creating a Tigris bucket for storage
* [list](/docs/flyctl/main-postgres-backup-list/)	 - List backups
* [restore](/docs/flyctl/main-postgres-backup-restore/)	 - Performs a WAL-based restore into a new Postgres cluster.

## Options

~~~
  -h, --help   help for backup
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [main postgres](/docs/flyctl/main-postgres/)	 - Manage Postgres clusters.

