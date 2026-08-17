Execute a command on a machine


## Usage
~~~
fly machine exec [machine-id] <command> [flags]
~~~

## Options

~~~
  -a, --app string         Application name
  -c, --config string      Path to application configuration file
      --container string   Container to run the command in
  -h, --help               help for exec
  -j, --json               JSON output
      --no-container       Run the command on the machine itself rather than in one of its containers
      --timeout int        Timeout in seconds
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly machine](/docs/flyctl/machine/)	 - Manage Fly Machines.

