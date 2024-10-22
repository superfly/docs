Detach Consul cluster from an app, and unsetting the FLY_CONSUL_URL secret

## Usage
~~~
fly consul detach [flags]
~~~

## Options

~~~
  -a, --app string             Application name
  -c, --config string          Path to application configuration file
  -h, --help                   help for detach
      --variable-name string   The secret name that will be removed from the app. (default "FLY_CONSUL_URL")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly consul](/docs/flyctl/consul/)	 - Enable and manage Consul clusters

