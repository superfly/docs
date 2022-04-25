Create a new persistent storage volume for an app (default size 10GB).

## Usage
~~~
flyctl volumes create <volumename> [flags]
~~~

## Options

~~~
  -a, --app string            Application name
  -c, --config string         Path to application configuration file
  -h, --help                  help for create
      --no-encryption         Do not encrypt the volume contents
  -r, --region string         The region to operate on
      --require-unique-zone   Require volume to be placed in separate hardware zone from existing volumes (default true)
  -s, --size int              Size of volume in gigabytes (default 10)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl volumes](/docs/flyctl/volumes/)	 - Volume management commands

