Restart one or more Fly machines


## Usage
~~~
fly machine restart [<id>...] [flags]
~~~

## Options

~~~
  -a, --app string           Application name
  -c, --config string        Path to application configuration file
      --force                Force stop the machine(s)
  -h, --help                 help for restart
  -s, --signal string        Signal to stop the machine with (default: SIGINT)
      --skip-health-checks   Restarts app without waiting for health checks.
      --time int             Seconds to wait before killing the machine
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly machine](/docs/flyctl/machine/)	 - Manage Fly Machines.

