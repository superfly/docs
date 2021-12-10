<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Authenticate docker
</p>

## About

Adds registry.fly.io to the docker daemon's authenticated registries. This allows you to push images directly to fly from the docker cli.

## Usage

~~~
flyctl auth docker [flags]
~~~

## Options

~~~
  -h, --help   help for docker
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl auth](/docs/flyctl/auth/)	 - Manage authentication

