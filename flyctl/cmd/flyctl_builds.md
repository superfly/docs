<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Work with Fly builds
</p>

## About

Fly builds are templates to make developing Fly applications easier.

## Usage

~~~
flyctl builds [command] [flags]
~~~

## Available Commands
* [list](/docs/flyctl/builds-list/)	 - List builds
* [logs](/docs/flyctl/builds-logs/)	 - Show logs associated with builds

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for builds
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

