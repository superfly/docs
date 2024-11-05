Update a machine


## Usage
~~~
fly machine update [machine_id] [flags]
~~~

## Options

~~~
  -a, --app string                  Application name
      --autostart                   Automatically start a stopped Machine when a network request is received (default true)
      --autostop string[="stop"]    Automatically stop a Machine when there are no network requests for it. Options include 'off', 'stop', and 'suspend'. (default "off")
      --build-depot                 Build your image with depot.dev
      --build-nixpacks              Build your image with nixpacks
  -C, --command string              Command to run
  -c, --config string               Path to application configuration file
      --detach                      Return immediately instead of monitoring deployment progress
      --dockerfile string           The path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --entrypoint string           The command to override the Docker ENTRYPOINT.
  -e, --env stringArray             Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --file-literal stringArray    Set of literals to write to the Machine, in the form of /path/inside/machine=VALUE pairs, where VALUE is the base64-encoded raw content. Can be specified multiple times.
      --file-local stringArray      Set of files to write to the Machine, in the form of /path/inside/machine=<local/path> pairs. Can be specified multiple times.
      --file-secret stringArray     Set of secrets to write to the Machine, in the form of /path/inside/machine=SECRET pairs, where SECRET is the name of the secret. The content of the secret must be base64 encoded. Can be specified multiple times.
  -h, --help                        help for update
      --host-dedication-id string   The dedication id of the reserved hosts for your organization (if any)
  -i, --image string                The Docker image to deploy
      --kernel-arg stringArray      A list of kernel arguments to provide to the init. Can be specified multiple times.
      --machine-config string       Read machine config from json file or string
  -m, --metadata stringArray        Metadata in the form of NAME=VALUE pairs. Can be specified multiple times.
      --mount-point string          New volume mount point
  -p, --port strings                The external ports and handlers for services, in the format: port[:machinePort][/protocol[:handler[:handler...]]])
                                    	For example: --port 80/tcp --port 443:80/tcp:http:tls --port 5432/tcp:pg_tls
                                    	To remove a port mapping use '-' as handler. For example: --port 80/tcp:-
      --restart string              Set the restart policy for a Machine. Options include 'no', 'always', and 'on-fail'.
                                    	Default is 'on-fail' for Machines created by 'fly deploy' and Machines with a schedule. Default is 'always' for Machines created by 'fly m run'.
      --schedule string             Schedule a Machine run at hourly, daily and monthly intervals
      --skip-dns-registration       Do not register the machine's 6PN IP with the internal DNS system
      --skip-health-checks          Updates machine without waiting for health checks.
      --skip-start                  Updates machine without starting it.
      --standby-for strings         For Machines without services, a comma separated list of Machine IDs to act as standby for.
      --vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                 Number of CPUs
      --vm-gpu-kind string          If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb, l40s, a10, none)
      --vm-gpus int                 Number of GPUs. Must also choose the GPU model with --vm-gpu-kind flag
      --vm-memory string            Memory (in megabytes) to attribute to the VM
      --vm-size string              The VM size to set machines to. See "fly platform vm-sizes" for valid values
      --wait-timeout int            Seconds to wait for individual machines to transition states and become healthy. (default 300) (default 300)
  -y, --yes                         Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly machine](/docs/flyctl/machine/)	 - Manage Fly Machines.

