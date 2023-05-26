Manage databases in a cluster


## Usage
~~~
flyctl postgres barman [command] [flags]
~~~

## Available Commands
* [backup](/docs/flyctl/postgres-barman-backup/)	 - Backup your database on barman
* [check](/docs/flyctl/postgres-barman-check/)	 - Check your barman connection
* [create](/docs/flyctl/postgres-barman-create/)	 - create barman machine
* [list-backup](/docs/flyctl/postgres-barman-list-backup/)	 - List your barman backups
* [recover](/docs/flyctl/postgres-barman-recover/)	 - Recover primary database with a barman backup
* [show-backup](/docs/flyctl/postgres-barman-show-backup/)	 - Show a single barman backup
* [switch-wal](/docs/flyctl/postgres-barman-switch-wal/)	 - Switch WAL to sync barman

## Options

~~~
  -h, --help   help for barman
  -j, --json   JSON output
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

