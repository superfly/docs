Update a volume for an app. Volumes are persistent storage for
		Fly Machines.

## Usage
~~~
fly volumes update <volume id> [flags]
~~~

## Options

~~~
  -a, --app string               Application name
  -c, --config string            Path to application configuration file
  -h, --help                     help for update
  -j, --json                     JSON output
      --scheduled-snapshots      Activate/deactivate scheduled automatic snapshots
      --snapshot-retention int   Snapshot retention in days
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly volumes](/docs/flyctl/volumes/)	 - Manage Fly Volumes.

