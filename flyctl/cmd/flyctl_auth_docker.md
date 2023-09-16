Adds registry.fly.io to the docker daemon's authenticated
registries. This allows you to push images directly to Fly from
the docker cli.


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
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl auth](/docs/flyctl/auth/)	 - Manage authentication

