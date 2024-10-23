Performs a WAL-based restore into a new Postgres cluster.


## Usage
~~~
fly postgres backup restore <destination-app-name> [flags]
~~~

## Options

~~~
  -a, --app string                   Application name
  -c, --config string                Path to application configuration file
      --detach                       Return immediately instead of monitoring deployment progress
  -h, --help                         help for restore
      --image-ref string             Specify a non-default base image for the restored Postgres app
      --restore-target-inclusive     Set to true to stop recovery after the specified time, or false to stop before it (default true)
      --restore-target-name string   ID or alias of backup to restore.
      --restore-target-time string   RFC3339-formatted timestamp up to which recovery will proceed. Example: 2021-07-16T12:34:56Z
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly postgres backup](/docs/flyctl/postgres-backup/)	 - Backup commands

