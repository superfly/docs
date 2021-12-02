<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Display an app's runtime environment variables
</p>

## About

Display an app's runtime environment variables. It displays a section for
secrets and another for config file defined environment variables.

## Usage

~~~
flyctl config env [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for env
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl config](/docs/flyctl/config/)	 - Manage an app's configuration

