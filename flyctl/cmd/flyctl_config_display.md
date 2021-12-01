# _flyctl config display_

Display an app's configuration

### About

Display an application's configuration. The configuration is presented
in JSON format. The configuration data is retrieved from the Fly service.

### Usage
~~~
flyctl config display [flags]
~~~

### Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for display
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl config](/docs/flyctl/config/)	 - Manage an app's configuration

