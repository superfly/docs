<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Change an app's VM count to the given value
</p>

## About

Change an app's VM count to the given value.

For pricing, see https://fly.io/docs/about/pricing/

## Usage

~~~
flyctl scale count <count> [flags]
~~~

## Options

~~~
  -a, --app string           App name to operate on
  -c, --config string        Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help                 help for count
      --max-per-region int   Max number of VMs per region (default -1)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl scale](/docs/flyctl/scale/)	 - Scale app resources

