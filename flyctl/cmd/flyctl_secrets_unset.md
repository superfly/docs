<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Remove encrypted secrets from an app
</p>

## About

Remove encrypted secrets from the application. Unsetting a
secret removes its availability to the application.

## Usage

~~~
flyctl secrets unset [flags] NAME NAME ...
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
      --detach          Return immediately instead of monitoring deployment progress
  -h, --help            help for unset
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl secrets](/docs/flyctl/secrets/)	 - Manage app secrets

