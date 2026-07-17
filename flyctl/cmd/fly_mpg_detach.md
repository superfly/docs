Detach a managed Postgres cluster from an app. This command will remove the attachment record linking the app to the cluster.
Note: This does NOT remove any secrets from the app. Use 'fly secrets unset' to remove secrets.

## Usage
~~~
fly mpg detach <CLUSTER ID> [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for detach
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mpg](/docs/flyctl/mpg/)	 - Manage Managed Postgres clusters.

