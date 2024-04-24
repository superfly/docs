Update Postgres configuration.

## Usage
~~~
fly postgres config update [flags]
~~~

## Options

~~~
  -a, --app string                          Application name
  -c, --config string                       Path to application configuration file
      --detach                              Return immediately instead of monitoring deployment progress
      --force                               Skips pg-setting value verification.
  -h, --help                                help for update
      --log-min-duration-statement string   Sets the minimum execution time above which all statements will be logged. (ms)
      --log-statement string                Sets the type of statements logged. (none, ddl, mod, all)
      --maintenance-work-mem string         Sets the maximum amount of memory used for maintenance operations like ALTER TABLE, CREATE INDEX, and VACUUM
      --max-connections string              Sets the maximum number of concurrent connections.
      --max-replication-slots string        Specifies the maximum number of replication slots. This should typically match max_wal_senders.
      --max-wal-senders string              Maximum number of concurrent connections from standby servers or streaming backup clients. (0 disables replication)
      --shared-buffers string               Sets the amount of memory the database server uses for shared memory buffers
      --shared-preload-libraries string     Sets the shared libraries to preload. (comma separated string)
      --wal-level string                    Sets the level of information written to the WAL. (minimal, replica, logical).
      --work-mem string                     Sets the maximum amount of memory each Postgres query can use
  -y, --yes                                 Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly postgres config](/docs/flyctl/postgres-config/)	 - Show and manage Postgres configuration.

