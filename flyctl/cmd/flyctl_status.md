<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Show app status
</p>

## About

Show the application's current status including application
details, tasks, most recent deployment details and in which regions it is
currently allocated.

## Usage

~~~
flyctl status [flags]
~~~

### Available Commands
* [instance](/docs/flyctl/status-instance/)	 - Show instance status

## Options

~~~
      --all             Show completed instances
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
      --deployment      Always show deployment status
  -h, --help            help for status
      --rate int        Refresh Rate for --watch (default 5)
      --watch           Refresh details
      --wtf string      wtf usage (default "defaultwtf")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

