This will update the application's image to the latest available version.
The update will perform a rolling restart against each VM, which may result in a brief service disruption.

## Usage
~~~
flyctl image update [flags]
~~~

## Options

~~~
  -a, --app string           Application name
  -c, --config string        Path to application configuration file
      --detach               Return immediately instead of monitoring update progress. (Nomad only)
  -h, --help                 help for update
      --image string         Target a specific image. (Machines only)
      --skip-health-checks   Skip waiting for health checks inbetween VM updates. (Machines only)
      --strategy string      Deployment strategy. (Nomad only)
  -y, --yes                  Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl image](/docs/flyctl/image/)	 - Manage app image

