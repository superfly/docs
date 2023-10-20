Fork the specified volume. Volume forking creates an independent copy of a storage volume for backup, testing, and experimentation without altering the original data.

## Usage
~~~
flyctl volumes fork [id] [flags]
~~~

## Options

~~~
  -a, --app string            Application name
  -c, --config string         Path to application configuration file
  -h, --help                  help for fork
  -j, --json                  JSON output
  -n, --name string           The name of the new volume
      --require-unique-zone   Place the volume in a separate hardware zone from existing volumes. This is the default.
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl volumes](/docs/flyctl/volumes/)	 - Manage Fly Volumes.

