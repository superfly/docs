<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Set VM memory
</p>

## About

Set VM memory to a number of megabytes

## Usage

~~~
flyctl scale memory <memoryMB> [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
      --group string    The process group to apply the memory size to
  -h, --help            help for memory
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl scale](/docs/flyctl/scale/)	 - Scale app resources

