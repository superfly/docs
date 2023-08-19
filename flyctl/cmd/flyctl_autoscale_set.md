V1 APPS ONLY: Enable autoscaling and set the application's autoscaling parameters:

min=int - minimum number of instances to be allocated globally.
max=int - maximum number of instances to be allocated globally.

## Usage
~~~
flyctl autoscale set [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for set
  -j, --json            JSON output
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl autoscale](/docs/flyctl/autoscale/)	 - V1 APPS ONLY: Autoscaling app resources

