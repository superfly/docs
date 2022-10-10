Restart one or more Fly machines


## Usage
~~~
flyctl machine restart <id> [<id>...] [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --force           Force stop the machine(s)
  -h, --help            help for restart
  -s, --signal string   Signal to stop the machine with (default: SIGINT)
      --time int        Seconds to wait before killing the machine
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

