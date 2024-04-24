Stop one or more Fly machines


## Usage
~~~
fly machine stop [<id>...] [flags]
~~~

## Options

~~~
  -a, --app string              Application name
  -c, --config string           Path to application configuration file
  -h, --help                    help for stop
  -s, --signal string           Signal to stop the machine with (default: SIGINT)
      --timeout int             Seconds to wait before sending SIGKILL to the machine
  -w, --wait-timeout duration   Time duration to wait for individual machines to transition states and become stopped.
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly machine](/docs/flyctl/machine/)	 - Manage Fly Machines.

