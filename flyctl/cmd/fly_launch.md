Create and configure a new app from source code or a Docker image.  Options passed after double dashes ("--") will be passed to the language specific scanner/dockerfile generator.

## Usage
~~~
fly launch [flags]
~~~

## Options

~~~
      --attach                           Attach this new application to the current application
      --auto-stop string                 Automatically suspend the app after a period of inactivity. Valid values are 'off', 'stop', and 'suspend (default "stop")
      --build-arg stringArray            Set of build time variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --build-only                       Build but do not deploy
      --build-secret stringArray         Set of build secrets of NAME=VALUE pairs. Can be specified multiple times. See https://docs.docker.com/engine/reference/commandline/buildx_build/#secret
      --build-target string              Set the target build stage to build if the Dockerfile has more than one stage
      --buildpacks-docker-host string    Address to docker daemon that will be exposed to the build container.
                                         If not set (or set to empty string) the standard socket location will be used.
                                         Special value 'inherit' may be used in which case DOCKER_HOST environment variable will be used.
                                         This option may set DOCKER_HOST environment variable for the build container if needed.
                                         
      --buildpacks-volume strings        Mount host volume into the build container, in the form '<host path>:<target path>[:<options>]'.
                                         - 'host path': Name of the volume or absolute directory path to mount.
                                         - 'target path': The path where the file or directory is available in the container.
                                         - 'options' (default "ro"): An optional comma separated list of mount options.
                                             - "ro", volume contents are read-only.
                                             - "rw", volume contents are readable and writeable.
                                             - "volume-opt=<key>=<value>", can be specified more than once, takes a key-value pair consisting of the option name and its value.
                                         Repeat for each volume in order (comma-separated lists not accepted)
                                         
  -c, --config string                    Path to application configuration file
      --copy-config                      Use the configuration file if present without prompting
      --deploy-retries string            Number of times to retry a deployment if it fails (default "auto")
      --depot string[="true"]            Deploy using depot to build the image (default "auto")
      --depot-scope string               The scope of the Depot builder's cache to use (org or app) (default "org")
      --detach                           Return immediately instead of monitoring deployment progress
      --dns-checks                       Perform DNS checks during deployment (default true)
      --dockerfile string                Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
      --dockerignore-from-gitignore      If a .dockerignore does not exist, create one from .gitignore files
  -e, --env stringArray                  Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --exclude-machines strings         Deploy to all machines except machines with these IDs. Multiple IDs can be specified with comma separated values or by providing the flag multiple times.
      --exclude-regions strings          Deploy to all machines except machines in these regions. Multiple regions can be specified with comma separated values or by providing the flag multiple times.
      --file-literal stringArray         Set of literals in the form of /path/inside/machine=VALUE pairs where VALUE is the content. Can be specified multiple times.
      --file-local stringArray           Set of files in the form of /path/inside/machine=<local/path> pairs. Can be specified multiple times.
      --file-secret stringArray          Set of secrets in the form of /path/inside/machine=SECRET pairs where SECRET is the name of the secret. Can be specified multiple times.
      --flycast                          Allocate a private IPv6 addresses
      --from string                      A github repo URL to use as a template for the new app
      --generate-name                    Always generate a name for the app, without prompting
      --ha                               Create spare machines that increases app availability (default true)
  -h, --help                             help for launch
      --host-dedication-id string        The dedication id of the reserved hosts for your organization (if any)
      --https-failover                   Determines whether to failover to plain internet(https) communication with remote builders if wireguard fails (default true)
      --ignorefile string                Path to a Docker ignore file. Defaults to the .dockerignore file in the working directory.
  -i, --image string                     The Docker image to deploy
      --image-label string               Image label to use when tagging and pushing to the fly registry. Defaults to "deployment-{timestamp}".
      --internal-port int                Set internal_port for all services in the generated fly.toml (default -1)
      --into string                      Destination directory for github repo specified with --from
      --json                             Generate configuration in JSON format
      --label stringArray                Add custom metadata to an image via docker labels
      --lease-timeout string             Time duration to lease individual machines while running deployment. All machines are leased at the beginning and released at the end.The lease is refreshed periodically for this same time, which is why it is short.flyctl releases leases in most cases. (default "13s")
      --local-only                       Perform builds locally using the local docker daemon. The default is --remote-only.
      --max-concurrent int               Maximum number of machines to operate on concurrently. (default 8)
      --max-unavailable float            Max number of unavailable machines during rolling updates. A number between 0 and 1 means percent of total machines (default 0.33)
      --name string                      Name of the new app
      --nixpacks                         Deploy using nixpacks to build the image
      --no-cache                         Do not use the build cache when building the image
      --no-create                        Do not create an app, only generate configuration files
      --no-db                            Skip automatically provisioning a database
      --no-deploy                        Do not immediately deploy the new app after fly launch creates and configures it
      --no-object-storage                Skip automatically provisioning an object storage bucket
      --no-public-ips                    Do not allocate any new public IP addresses
      --no-redis                         Skip automatically provisioning a Redis instance
      --now                              Deploy now without confirmation
      --only-machines strings            Deploy to machines only with these IDs. Multiple IDs can be specified with comma separated values or by providing the flag multiple times.
  -o, --org string                       The target Fly.io organization
      --path string                      Path to the app source root, where fly.toml file will be saved (default ".")
      --process-groups strings           Deploy to machines only in these process groups
      --push                             Push image to registry after build is complete
      --recreate-builder                 Recreate the builder app, if it exists
  -r, --region string                    The target region (see 'flyctl platform regions')
      --regions strings                  Deploy to machines only in these regions. Multiple regions can be specified with comma separated values or by providing the flag multiple times.
      --release-command-timeout string   Time duration to wait for a release command finish running, or 'none' to disable. (default "5m0s")
      --remote-only                      Perform builds on a remote builder instance instead of using the local docker daemon. This is the default. Use --local-only to build locally.
  -s, --signal string                    Signal to stop the machine with for bluegreen strategy (default: SIGINT)
      --smoke-checks                     Perform smoke checks during deployment (default true)
      --strategy string                  The strategy for replacing running instances. Options are canary, rolling, bluegreen, or immediate. The default strategy is rolling.
      --vm-cpu-kind string               The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                      Number of CPUs
      --vm-gpu-kind string               If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb, l40s, a10, none)
      --vm-gpus int                      Number of GPUs. Must also choose the GPU model with --vm-gpu-kind flag
      --vm-memory string                 Memory (in megabytes) to attribute to the VM
      --vm-size string                   The VM size to set machines to. See "fly platform vm-sizes" for valid values
      --volume-initial-size int          The initial size in GB for volumes created on first deploy
      --wait-timeout string              Time duration to wait for individual machines to transition states and become healthy. (default "5m0s")
      --wg                               Determines whether communication with remote builders are conducted over wireguard or plain internet(https) (default true)
      --yaml                             Generate configuration in YAML format
  -y, --yes                              Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

