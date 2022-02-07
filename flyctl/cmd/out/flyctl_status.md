Show the application's current status including application
details, tasks, most recent deployment details and in which regions it is
currently allocated.


## Usage
~~~
flyctl status [flags]
~~~

## Available Commands
* [instance](/docs/flyctl/status-instance/)	 - Show instance status

## Options

~~~
      --all             Show completed instances
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --deployment      Always show deployment status
  -h, --help            help for status
      --rate int        Refresh Rate for --watch (default 5)
      --watch           Refresh details
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

