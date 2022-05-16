Run a machine


## Usage
~~~
flyctl machine run <image> [command] [flags]
~~~

## Options

~~~
  -a, --app string          Application name
  -c, --config string       Path to application configuration file
      --dockerfile string   Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
  -e, --env strings         Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
  -h, --help                help for run
      --id string           Machine ID, if previously known
  -n, --name string         Machine name, will be generated if missing
      --org string          The organization that will own the app
  -p, --port strings        Exposed port mappings (format: edgePort[:machinePort]/[protocol[:handler]])
  -r, --region string       The region to operate on
  -s, --size string         Preset guest cpu and memory for a machine, defaults to shared-cpu-1x
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

