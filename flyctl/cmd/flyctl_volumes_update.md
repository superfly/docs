Update a volume for an app. Volumes are persistent storage for
		Fly Machines. Learn how to add a volume to
		your app: https://fly.io/docs/apps/volume-storage/

## Usage
~~~
flyctl volumes update <volumename> [flags]
~~~

## Options

~~~
  -a, --app string               Application name
  -c, --config string            Path to application configuration file
  -h, --help                     help for update
  -j, --json                     JSON output
      --scheduled-snapshots      Disable/Enable scheduled snapshots
      --snapshot-retention int   Snapshot retention in days (min 5)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl volumes](/docs/flyctl/volumes/)	 - Manage Fly Volumes.

