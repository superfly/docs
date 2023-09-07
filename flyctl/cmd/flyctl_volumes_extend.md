Extends a target volume to the size specified. The instance is automatically restarted for Nomad (V1) apps.
		Most Machines (V2 apps) don't require a restart. Older Machines get a message to manually restart the Machine
		to increase the size of the FS.

## Usage
~~~
flyctl volumes extend [id] [flags]
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

* [flyctl volumes](/docs/flyctl/volumes/)	 - Volume management commands

