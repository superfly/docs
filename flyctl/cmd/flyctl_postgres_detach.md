# _flyctl postgres detach_

Detach a postgres cluster from an app

### About

Detach a postgres cluster from an app

### Usage
~~~
flyctl postgres detach [flags]
~~~

### Options

~~~
  -a, --app string            App name to operate on
  -c, --config string         Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help                  help for detach
      --postgres-app string   the postgres cluster to detach from the app
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl postgres](/docs/flyctl/postgres/)	 - Manage postgres clusters

