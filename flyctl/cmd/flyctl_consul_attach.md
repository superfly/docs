Attach Consul cluster to an app, and setting the `FLY_CONSUL_URL` secret


## Usage
~~~
flyctl consul attach [flags]
~~~

## Options

~~~
  -a, --app string             Application name
  -c, --config string          Path to application configuration file
  -h, --help                   help for attach
      --variable-name string   The environment variable name that will be added to the consuming app. (default "FLY_CONSUL_URL")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               verbose output
~~~

## See Also

* [flyctl consul](/docs/flyctl/consul/)	 - Manage Postgres clusters.

