Connect to a running instance of the current app; with -select, choose instance from list.

## Usage
~~~
flyctl ssh console [<host>] [flags]
~~~

## Options

~~~
  -a, --app string       App name to operate on
  -C, --command string   command to run on SSH session
  -c, --config string    Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help             help for console
  -p, --probe            test WireGuard connection after establishing
  -r, --region string    Region to create WireGuard connection in
  -s, --select           select available instances
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl ssh](/docs/flyctl/ssh/)	 - Commands that manage SSH credentials

