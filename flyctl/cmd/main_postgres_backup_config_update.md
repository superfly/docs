Update backup configuration


## Usage
~~~
main postgres backup config update [flags]
~~~

## Options

~~~
  -a, --app string                     Application name
      --archive-timeout string         Archive timeout
  -c, --config string                  Path to application configuration file
      --full-backup-frequency string   Full backup frequency
  -h, --help                           help for update
      --minimum-redundancy string      Minimum redundancy
      --recovery-window string         Recovery window
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [main postgres backup config](/docs/flyctl/main-postgres-backup-config/)	 - Manage backup configuration

