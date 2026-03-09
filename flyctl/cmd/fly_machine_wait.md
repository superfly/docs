Wait for a machine to reach a state


## Usage
~~~
fly machine wait [id] [flags]
~~~

## Options

~~~
  -a, --app string              Application name
  -c, --config string           Path to application configuration file
  -h, --help                    help for wait
      --state string            Machine state to wait for (default "settled")
  -w, --wait-timeout duration   Time duration to wait for the machine to reach the requested state. (default 5m0s)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly machine](/docs/flyctl/machine/)	 - Manage Fly Machines.

