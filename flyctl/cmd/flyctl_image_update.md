This will update the application's image to the latest available version. The update will perform a rolling restart against each VM, which may result in a brief service disruption.

## Usage

~~~
flyctl image update [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
      --detach          Return immediately instead of monitoring update progress
  -h, --help            help for update
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl image](/docs/flyctl/image/)	 - Manage app image

