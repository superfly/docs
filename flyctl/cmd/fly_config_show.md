Show an application's configuration. The configuration is presented by default
in JSON format. The configuration data is retrieved from the Fly service.

## Usage
~~~
fly config show [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for show
      --local           Parse and show local fly.toml file instead of fetching from the Fly service
      --toml            Show configuration in TOML format
      --yaml            Show configuration in YAML format
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly config](/docs/flyctl/config/)	 - Manage an app's configuration

