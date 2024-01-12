Stop one or more Fly machines


## Usage
~~~
flyctl machine stop [<id>...] [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for stop
  -s, --signal string   Signal to stop the machine with (default: SIGINT)
      --timeout int     Seconds to wait before sending SIGKILL to the machine
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Manage Fly Machines.

