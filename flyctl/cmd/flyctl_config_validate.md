<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Validate an app's config file
</p>

## About

Validates an application's config file against the Fly platform to
ensure it is correct and meaningful to the platform.

## Usage

~~~
flyctl config validate [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for validate
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl config](/docs/flyctl/config/)	 - Manage an app's configuration

