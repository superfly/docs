Update Postgres configuration.


## Usage
~~~
flyctl postgres config update [flags]
~~~

## Options

~~~
  -a, --app string                          Application name
      --auto-confirm                        Will automatically confirm changes without an interactive prompt.
  -c, --config string                       Path to application configuration file
  -h, --help                                help for update
      --log-min-duration-statement string   Sets the minimum execution time above which all statements will be logged. (ms)
      --log-statement string                Sets the type of statements logged. (none, ddl, mod, all)
      --max-connections string              Sets the maximum number of concurrent connections.
      --wal-level string                    Sets the level of information written to the WAL. (minimal, replica, logical).
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl postgres config](/docs/flyctl/postgres-config/)	 - View and manage Postgres configuration.

