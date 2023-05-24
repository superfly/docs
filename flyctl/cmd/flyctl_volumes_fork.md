Volume forking creates an independent copy of a storage volume for backup, testing, and experimentation without altering the original data,
but is currently restricted to same-host forks and may not be available for near-capacity hosts.

## Usage
~~~
flyctl volumes fork <id> [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for fork
  -j, --json            JSON output
  -n, --name string     Name of the new volume
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl volumes](/docs/flyctl/volumes/)	 - Volume management commands

