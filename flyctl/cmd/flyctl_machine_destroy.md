Destroy a Fly machine.
This command requires a machine to be in a stopped state unless the force flag is used.


## Usage
~~~
flyctl machine destroy <id> [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -f, --force           force kill machine regardless of current state
  -h, --help            help for destroy
      --select          Select from a list of machines
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

