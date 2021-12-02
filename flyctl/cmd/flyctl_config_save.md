<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Save an app's config file
</p>

## About

Save an application's configuration locally. The configuration data is
retrieved from the Fly service and saved in TOML format.

## Usage

~~~
flyctl config save [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for save
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl config](/docs/flyctl/config/)	 - Manage an app's configuration

