Allows the setting of the current models autoscaling parameters:

* `min=int` - minimum number of instances to be allocated from region pool.
* `max=int` - maximum number of instances to be allocated from region pool.

## Usage

~~~
flyctl autoscale set [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for set
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl autoscale](/docs/flyctl/autoscale/)	 - Autoscaling app resources

