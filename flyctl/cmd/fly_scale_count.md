Change an app's VM count to the given value.

For pricing, see https://fly.io/docs/about/pricing/

## Usage
~~~
fly scale count [count] [flags]
~~~

## Options

~~~
  -a, --app string                  Application name
  -c, --config string               Path to application configuration file
  -e, --env stringArray             Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --from-snapshot string        New volumes are restored from snapshot, use 'last' for most recent snapshot. The default is an empty volume
  -h, --help                        help for count
      --host-dedication-id string   The dedication id of the reserved hosts for your organization (if any)
      --max-per-region int          Max number of VMs per region (default -1)
  -g, --process-group string        The process group to scale
  -r, --region string               Comma separated list of regions to act on. Defaults to all regions where there is at least one machine running for the app
      --vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                 Number of CPUs
      --vm-gpu-kind string          If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb, l40s, a10, none)
      --vm-gpus int                 Number of GPUs. Must also choose the GPU model with --vm-gpu-kind flag
      --vm-memory string            Memory (in megabytes) to attribute to the VM
      --vm-size string              The VM size to set machines to. See "fly platform vm-sizes" for valid values
      --with-new-volumes            New machines each get a new volumes even if there are unattached volumes available
  -y, --yes                         Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly scale](/docs/flyctl/scale/)	 - Scale app resources

