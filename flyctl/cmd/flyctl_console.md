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
  -a, --app string       Application name
  -c, --config string    Path to application configuration file
  -h, --help             help for console
      --machine string   Run the console in the existing machine with the specified ID
  -s, --select           Select the machine on which to execute the console from a list
  -u, --user string      Unix username to connect as (default "root")
      --vm-cpus int      How many (shared) CPUs to give the new machine
      --vm-memory int    How much memory (in MB) to give the new machine
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

