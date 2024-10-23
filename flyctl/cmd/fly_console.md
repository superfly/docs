Run a console in a new or existing machine. The console command is
specified by the `console_command` configuration field. By default, a
new machine is created by default using the app's most recently deployed
image. An existing machine can be used instead with --machine.

## Usage
~~~
fly console [flags]
~~~

## Options

~~~
  -a, --app string                  Application name
  -C, --command string              command to run on SSH session
  -c, --config string               Path to application configuration file
      --dockerfile string           Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --entrypoint string           ENTRYPOINT replacement
  -e, --env stringArray             Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --file-literal stringArray    Set of literals to write to the Machine, in the form of /path/inside/machine=VALUE pairs, where VALUE is the base64-encoded raw content. Can be specified multiple times.
      --file-local stringArray      Set of files to write to the Machine, in the form of /path/inside/machine=<local/path> pairs. Can be specified multiple times.
      --file-secret stringArray     Set of secrets to write to the Machine, in the form of /path/inside/machine=SECRET pairs, where SECRET is the name of the secret. The content of the secret must be base64 encoded. Can be specified multiple times.
  -h, --help                        help for console
      --host-dedication-id string   The dedication id of the reserved hosts for your organization (if any)
  -i, --image string                image to use (default: current release)
      --machine string              Run the console in the existing machine with the specified ID
  -p, --port strings                Publish ports, format: port[:machinePort][/protocol[:handler[:handler...]]])
                                    		i.e.: --port 80/tcp --port 443:80/tcp:http:tls --port 5432/tcp:pg_tls
                                    		To remove a port mapping use '-' as handler, i.e.: --port 80/tcp:-
  -r, --region string               The target region (see 'flyctl platform regions')
  -s, --select                      Select the machine on which to execute the console from a list.
  -u, --user string                 Unix username to connect as (default "root")
      --vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                 Number of CPUs
      --vm-gpu-kind string          If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb, l40s, a10, none)
      --vm-gpus int                 Number of GPUs. Must also choose the GPU model with --vm-gpu-kind flag
      --vm-memory string            Memory (in megabytes) to attribute to the VM
      --vm-size string              The VM size to set machines to. See "fly platform vm-sizes" for valid values
      --volume strings              Volume to mount, in the form of <volume_id_or_name>:/path/inside/machine[:<options>]
      --wg                          Determines whether communication with remote builders are conducted over wireguard or plain internet(https) (default true)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

