<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Show detailed app information
</p>

## About

Shows information about the application on the Fly platform

Information includes the application's
* name, owner, version, status and hostname
* services
* IP addresses

## Usage

~~~
flyctl info [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for info
      --host            Returns just the hostname
  -n, --name            Returns just the appname
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

