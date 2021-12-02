<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Allocate an IPv4 address
</p>

## About

Allocates an IPv4 address to the application.

## Usage

~~~
flyctl ips allocate-v4 [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for allocate-v4
      --region string   The region where the address should be allocated
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl ips](/docs/flyctl/ips/)	 - Manage IP addresses for apps

