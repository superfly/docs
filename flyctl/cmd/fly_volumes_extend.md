Extend a volume to the specified size. Most Machines don't require a restart after extending a volume. Some older Machines get a message to manually restart the Machine to increase the size of the file system.

## Usage
~~~
fly volumes extend <volume id> [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for extend
  -j, --json            JSON output
  -s, --size string     Target volume size in gigabytes
  -y, --yes             Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly volumes](/docs/flyctl/volumes/)	 - Manage Fly Volumes.

