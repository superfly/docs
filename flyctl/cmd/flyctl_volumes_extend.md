Extends a target volume to the size specified. Volumes with attached nomad allocations
		will be restarted automatically. Machines will require a manual restart to increase the size
		of the FS.

## Usage
~~~
flyctl volumes extend <id> [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for extend
  -s, --size int        Target volume size in gigabytes
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl volumes](/docs/flyctl/volumes/)	 - Volume management commands

