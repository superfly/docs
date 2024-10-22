Destroy one or more Fly machines.
This command requires a machine to be in a stopped or suspended state unless the force flag is used.


## Usage
~~~
fly machine destroy [flags] ID ID ...
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -f, --force           force kill machine regardless of current state
  -h, --help            help for destroy
  -i, --image string    remove all machines with the specified image hash
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly machine](/docs/flyctl/machine/)	 - Manage Fly Machines.

