Save an application's configuration locally. The configuration data is
retrieved from the Fly service and saved in TOML format.

## Usage
~~~
fly config save [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for save
      --json            Output the configuration in JSON format
      --yaml            Output the configuration in YAML format
  -y, --yes             Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly config](/docs/flyctl/config/)	 - Manage an app's configuration

