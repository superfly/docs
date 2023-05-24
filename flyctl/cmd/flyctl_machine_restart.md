Restart one or more Fly machines


## Usage
~~~
flyctl machine restart <id> [<id>...] [flags]
~~~

## Options

~~~
  -a, --app string           Application name
  -c, --config string        Path to application configuration file
      --force                Force stop the machine(s)
  -h, --help                 help for restart
      --select               Select from a list of machines
  -s, --signal string        Signal to stop the machine with (default: SIGINT)
      --skip-health-checks   Restarts app without waiting for health checks. ( Machines only )
      --time int             Seconds to wait before killing the machine
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

