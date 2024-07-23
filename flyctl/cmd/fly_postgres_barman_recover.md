Recover primary database with a barman backup

## Usage
~~~
fly postgres barman recover <primary machine ID> [flags]
~~~

## Options

~~~
  -a, --app string           Application name
  -b, --backup-id string     choose one backup ID. Default: latest (default "latest")
  -c, --config string        Path to application configuration file
  -h, --help                 help for recover
  -T, --target-time string   choose a target time for PITR. Example: "2023-05-16 20:55:05.958774+00:00". Default: last WAL file on barman
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly postgres barman](/docs/flyctl/postgres-barman/)	 - Manage databases in a cluster

