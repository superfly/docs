This will update the application's image to the latest available version.
The update will perform a rolling restart against each VM, which may result in a brief service disruption.

## Usage
~~~
flyctl image update [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --detach          Return immediately instead of monitoring update progress
  -h, --help            help for update
  -y, --yes             Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl image](/docs/flyctl/image/)	 - Manage app image

