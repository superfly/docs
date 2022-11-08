Create new volume for app. --region flag must be included to specify
region the volume exists in. --size flag is optional, defaults to 10,
sets the size as the number of gigabytes the volume will consume.

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
  -r, --region string         The target region (see 'flyctl platform regions')
      --require-unique-zone   Require volume to be placed in separate hardware zone from existing volumes (default true)
  -s, --size int              Size of volume in gigabytes (default 3)
      --snapshot-id string    Create volume from a specified snapshot
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl volumes](/docs/flyctl/volumes/)	 - Volume management commands

