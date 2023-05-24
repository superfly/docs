Run a machine


## Usage
~~~
flyctl machine run <image> [command] [flags]
~~~

## Options

~~~
  -a, --app string               Application name
      --autostart                Automatically start a stopped machine when a network request is received (default true)
      --autostop                 Automatically stop a machine when there aren't network requests for it (default true)
      --build-nixpacks           Build your image with nixpacks
  -c, --config string            Path to application configuration file
      --detach                   Return immediately instead of monitoring deployment progress
      --dockerfile string        Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --entrypoint string        ENTRYPOINT replacement
  -e, --env stringArray          Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
  -h, --help                     help for run
      --id string                Machine ID, if previously known
      --kernel-arg stringArray   List of kernel arguments to be provided to the init. Can be specified multiple times.
  -m, --metadata stringArray     Metadata in the form of NAME=VALUE pairs. Can be specified multiple times.
  -n, --name string              Machine name, will be generated if missing
      --org string               The organization that will own the app
  -p, --port strings             Publish ports, format: port[:machinePort][/protocol[:handler[:handler...]]])
                                 	i.e.: --port 80/tcp --port 443:80/tcp:http:tls --port 5432/tcp:pg_tls
                                 	To remove a port mapping use '-' as handler, i.e.: --port 80/tcp:-
  -r, --region string            The target region (see 'flyctl platform regions')
      --restart string           Configure restart policy, for a machine. Options include 'no', 'always' and 'on-fail'. Default is set to always
      --rm                       Automatically remove the machine when it exits
      --schedule string          Schedule a machine run at hourly, daily and monthly intervals
      --skip-dns-registration    Do not register the machine's 6PN IP with the internal DNS system
      --standby-for strings      Comma separated list of machine ids to watch for
      --vm-cpus int              Number of CPUs
      --vm-memory int            Memory (in megabytes) to attribute to the machine
  -s, --vm-size string           Preset guest cpu and memory for a machine, defaults to shared-cpu-1x
  -v, --volume strings           Volumes to mount in the form of <volume_id_or_name>:/path/inside/machine[:<options>]
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

