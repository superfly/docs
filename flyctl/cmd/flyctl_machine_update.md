Update a machine


## Usage
~~~
flyctl machine update [machine_id] [flags]
~~~

## Options

~~~
  -a, --app string           Application name
  -c, --config string        Path to application configuration file
      --cpus int             Number of CPUs
      --dockerfile string    Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --entrypoint string    ENTRYPOINT replacement
  -e, --env strings          Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
  -h, --help                 help for update
  -i, --image string         The Docker image to deploy
      --kernel-arg strings   List of kernel arguments to be provided to the init. Can be specified multiple times.
      --memory int           Memory (in megabytes) to attribute to the machine
  -m, --metadata strings     Metadata in the form of NAME=VALUE pairs. Can be specified multiple times.
  -p, --port strings         Exposed port mappings (format: edgePort[:machinePort]/[protocol[:handler]])
      --schedule string      Schedule a machine run at hourly, daily and monthly intervals
  -s, --size string          Preset guest cpu and memory for a machine, defaults to shared-cpu-1x
      --skip-health-checks   Updates machine without waiting for health checks.
  -v, --volume strings       Volumes to mount in the form of <volume_id_or_name>:/path/inside/machine[:<options>]
  -y, --yes                  Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

