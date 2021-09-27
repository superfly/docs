# _flyctl machine run_

Launch a Fly machine

### About

Launch Fly machine with the provided image and command

### Usage
~~~
flyctl machine run <image> [command] [flags]
~~~

### Options

~~~
  -a, --app string                       App name to operate on
      --build-arg strings                Set of build time variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --build-local-only                 Only perform builds locally using the local docker daemon
      --build-remote-only                Perform builds remotely without using the local docker daemon
      --build-target string              Set the target build stage to build if the Dockerfile has more than one stage
  -c, --config string                    Path to an app config file or directory containing one (default "./fly.toml")
  -d, --detach                           Detach from the machine's logs
      --dockerfile string                Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --entrypoint string                ENTRYPOINT replacement
  -e, --env strings                      Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
  -h, --help                             help for run
      --id string                        Machine ID, is previously known
      --image-label string               Image label to use when tagging and pushing to the fly registry. Defaults to "deployment-{timestamp}".
  -n, --name string                      Machine name, will be generated if missing
      --org string                       The organization that will own the app
  -p, --port strings                     Exposed port mappings (format: edgePort[:machinePort]/[protocol[:handler]])
  -r, --region flyctl platform regions   Region to deploy the machine to (see flyctl platform regions)
  -s, --size string                      Size of the machine
  -v, --volume strings                   Volumes to mount in the form of <volume_id_or_name>:/path/inside/machine[:<options>]
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

