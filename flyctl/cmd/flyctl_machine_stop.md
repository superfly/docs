Stop one or more Fly machines


## Usage
~~~
flyctl machine stop <id> [<id>...] [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for stop
      --select          Select from a list of machines
  -s, --signal string   Signal to stop the machine with (default: SIGINT)
      --timeout int     Seconds to wait before sending SIGKILL to the machine
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

