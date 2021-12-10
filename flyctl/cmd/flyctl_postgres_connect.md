# _flyctl postgres connect_

Connect to postgres cluster

### About

Connect to postgres cluster

### Usage
~~~
flyctl postgres connect [flags]
~~~

### Options

~~~
  -a, --app string        App name to operate on
  -c, --config string     Path to an app config file or directory containing one (default "./fly.toml")
      --database string   The postgres database to connect to
  -h, --help              help for connect
      --password string   The postgres user password
      --user string       The postgres user to connect with
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl postgres](/docs/flyctl/postgres/)	 - Manage postgres clusters

