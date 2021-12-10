# _flyctl volumes create_

Create new volume for app

### About

Create new volume for app. --region flag must be included to specify
region the volume exists in. --size flag is optional, defaults to 10,
sets the size as the number of gigabytes the volume will consume.

### Usage
~~~
flyctl volumes create <volumename> [flags]
~~~

### Options

~~~
  -a, --app string            App name to operate on
  -c, --config string         Path to an app config file or directory containing one (default "./fly.toml")
      --encrypted             Encrypt the volume (default true)
  -h, --help                  help for create
      --region string         Set region for new volume
      --require-unique-zone   Require volume to be placed in separate hardware zone from existing volumes (default true)
      --size int              Size of volume in gigabytes (default 10)
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl volumes](/docs/flyctl/volumes/)	 - Volume management commands

