Update a machine


## Usage
~~~
flyctl machine update <machine_id> [flags]
~~~

## Options

~~~
  -a, --app string               Application name
      --autostart                Automatically start a stopped machine when a network request is received (default true)
      --autostop                 Automatically stop a machine when there aren't network requests for it (default true)
      --build-nixpacks           Build your image with nixpacks
  -C, --command string           Command to run
  -c, --config string            Path to application configuration file
      --detach                   Return immediately instead of monitoring deployment progress
      --dockerfile string        Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --entrypoint string        ENTRYPOINT replacement
  -e, --env stringArray          Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
  -h, --help                     help for update
  -i, --image string             The Docker image to deploy
      --kernel-arg stringArray   List of kernel arguments to be provided to the init. Can be specified multiple times.
  -m, --metadata stringArray     Metadata in the form of NAME=VALUE pairs. Can be specified multiple times.
      --mount-point string       New volume mount point
  -p, --port strings             Publish ports, format: port[:machinePort][/protocol[:handler[:handler...]]])
                                 	i.e.: --port 80/tcp --port 443:80/tcp:http:tls --port 5432/tcp:pg_tls
                                 	To remove a port mapping use '-' as handler, i.e.: --port 80/tcp:-
      --restart string           Configure restart policy, for a machine. Options include 'no', 'always' and 'on-fail'. Default is set to always
      --schedule string          Schedule a machine run at hourly, daily and monthly intervals
      --select                   Select from a list of machines
      --skip-dns-registration    Do not register the machine's 6PN IP with the internal DNS system
      --skip-health-checks       Updates machine without waiting for health checks.
      --standby-for strings      Comma separated list of machine ids to watch for
      --vm-cpus int              Number of CPUs
      --vm-memory int            Memory (in megabytes) to attribute to the machine
  -s, --vm-size string           Preset guest cpu and memory for a machine, defaults to shared-cpu-1x
  -y, --yes                      Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

