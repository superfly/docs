<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Attach a postgres cluster to an app
</p>

## About

Attach a postgres cluster to an app

## Usage

~~~
flyctl postgres attach [flags]
~~~

## Options

~~~
  -a, --app string             App name to operate on
  -c, --config string          Path to an app config file or directory containing one (default "./fly.toml")
      --database-name string   database to use, defaults to a new database with the same name as the app
  -h, --help                   help for attach
      --postgres-app string    the postgres cluster to attach to the app
      --variable-name string   the env variable name that will be added to the app. Defaults to DATABASE_URL
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl postgres](/docs/flyctl/postgres/)	 - Manage postgres clusters

