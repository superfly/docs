Simulate a batch of Machine placements across multiple regions


## Usage
~~~
fly machine place [flags]
~~~

## Options

~~~
  -c, --config string               Path to application configuration file
      --count int                   number of machines to place
  -h, --help                        help for place
      --host-dedication-id string   The dedication id of the reserved hosts for your organization (if any)
  -j, --json                        JSON output
  -o, --org string                  The target Fly.io organization
      --region string               comma-delimited list of regions to place machines
      --vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                 Number of CPUs
      --vm-gpu-kind string          If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb, l40s, a10, none)
      --vm-gpus int                 Number of GPUs. Must also choose the GPU model with --vm-gpu-kind flag
      --vm-memory string            Memory (in megabytes) to attribute to the VM
      --vm-size string              The VM size to set machines to. See "fly platform vm-sizes" for valid values
      --volume-name string          name of the volume to place machines
      --volume-size int             size of the desired volume to place machines
      --weights strings             comma-delimited list of key=value weights to adjust placement preferences. e.g., 'region=5,spread=10'
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly machine](/docs/flyctl/machine/)	 - Manage Fly Machines.

