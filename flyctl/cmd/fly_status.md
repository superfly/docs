Show the application's current status including application
details, tasks, most recent deployment details and in which regions it is
currently allocated.


## Usage
~~~
fly status [flags]
~~~

## Options

~~~
      --all             Show completed instances
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --deployment      Always show deployment status
  -h, --help            help for status
  -j, --json            JSON output
      --rate int        Refresh Rate for --watch (default 5)
      --watch           Refresh details
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

