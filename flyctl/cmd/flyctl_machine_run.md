Run a machine


## Usage
~~~
flyctl machine run <image> [command] [flags]
~~~

## Options

~~~
  -a, --app string            Application name
      --build-arg strings     Set of build time variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --build-local-only      Only perform builds locally using the local docker daemon
      --build-only            
      --build-remote-only     Perform builds remotely without using the local docker daemon
      --build-target string   Set the target build stage to build if the Dockerfile has more than one stage
  -c, --config string         Path to application configuration file
      --cpu-kind string       Kind of CPU to use (shared, dedicated)
      --cpus int              Number of CPUs
  -d, --detach                Detach from the machine's logs
      --dockerfile string     Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --entrypoint string     ENTRYPOINT replacement
  -e, --env strings           Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
  -h, --help                  help for run
      --id string             Machine ID, if previously known
      --image-label string    Image label to use when tagging and pushing to the fly registry. Defaults to "deployment-{timestamp}".
      --memory int            Memory (in megabytes) to attribute to the machine
  -n, --name string           Machine name, will be generated if missing
      --no-build-cache        Do not use the cache when building the image
      --org string            The organization that will own the app
  -p, --port strings          Exposed port mappings (format: edgePort[:machinePort]/[protocol[:handler]])
  -r, --region string         The region to operate on
  -s, --size string           Preset guest cpu and memory for a machine
  -v, --volume strings        Volumes to mount in the form of <volume_id_or_name>:/path/inside/machine[:<options>]
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

