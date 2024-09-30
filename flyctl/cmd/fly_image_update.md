Update the app's image to the latest available version.
The update will perform a rolling restart against each Machine, which may result in a brief service disruption.

## Usage
~~~
fly image update [flags]
~~~

## Options

~~~
  -a, --app string           Application name
  -c, --config string        Path to application configuration file
  -h, --help                 help for update
      --image string         Target a specific image
      --skip-health-checks   Skip waiting for health checks inbetween VM updates.
  -y, --yes                  Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly image](/docs/flyctl/image/)	 - Manage app image

