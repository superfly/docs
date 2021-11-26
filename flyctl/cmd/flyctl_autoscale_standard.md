# _flyctl autoscale standard_

Configure a standard balanced app with params (min=int max=int)

### About

Configure the app without traffic balancing with the given parameters:

min=int - minimum number of instances to be allocated from region pool.
max=int - maximum number of instances to be allocated from region pool.

### Usage
~~~
flyctl autoscale standard [flags]
~~~

### Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for standard
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl autoscale](/docs/flyctl/autoscale/)	 - Autoscaling app resources

