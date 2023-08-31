Run a console in a new or existing machine. The console command is
specified by the `console_command` configuration field. By default, a
new machine is created by default using the app's most recently deployed
image. An existing machine can be used instead with --machine.

## Usage
~~~
flyctl console [flags]
~~~

## Options

~~~
  -a, --app string          Application name
  -c, --config string       Path to application configuration file
  -h, --help                help for console
      --machine string      Run the console in the existing machine with the specified ID
  -r, --region string       The target region (see 'flyctl platform regions')
  -s, --select              Select the machine on which to execute the console from a list
  -u, --user string         Unix username to connect as (default "root")
      --vm-cpukind string   The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int         Number of CPUs
      --vm-memory int       Memory (in megabytes) to attribute to the VM
      --vm-size string      The VM size to set machines to. See "fly platform vm-sizes" for valid values
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly.io command line interface

