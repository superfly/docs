<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Read secrets in name=value from stdin
</p>

## About

Set one or more encrypted secrets for an application. Values
are read from stdin as name=value

## Usage

~~~
flyctl secrets import [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
      --detach          Return immediately instead of monitoring deployment progress
  -h, --help            help for import
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl secrets](/docs/flyctl/secrets/)	 - Manage app secrets

