Adds registry.fly.io to the docker daemon's authenticated
registries. This allows you to push images directly to fly from
the docker cli.


## Usage
~~~
fly auth docker [flags]
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

* [fly auth](/docs/flyctl/auth/)	 - Manage authentication

