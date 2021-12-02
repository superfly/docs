<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Show a VM's status
</p>

## About

Show a VM's current status including logs, checks, and events.

## Usage

~~~
flyctl vm status <vm-id> [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for status
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl vm](/docs/flyctl/vm/)	 - Commands that manage VM instances

