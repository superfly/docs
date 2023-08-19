Validates an application's config file against the Fly platform to
ensure it is correct and meaningful to the platform.

## Usage
~~~
flyctl config validate [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for validate
      --machines        Forces apps v2 config validation
      --nomad           Forces apps v1 config validation
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl config](/docs/flyctl/config/)	 - Manage an app's configuration

