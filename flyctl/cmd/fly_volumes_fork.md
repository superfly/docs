Fork the specified volume. Volume forking creates an independent copy of a storage volume for backup, testing, and experimentation without altering the original data.

## Usage
~~~
fly volumes fork <volume id> [flags]
~~~

## Options

~~~
  -a, --app string                  Application name
  -c, --config string               Path to application configuration file
  -h, --help                        help for fork
      --host-dedication-id string   The dedication id of the reserved hosts for your organization (if any)
  -j, --json                        JSON output
  -n, --name string                 The name of the new volume
  -r, --region string               The target region. By default, the new volume will be created in the source volume's region.
      --require-unique-zone         Place the volume in a separate hardware zone from existing volumes. This is the default. (default true)
      --vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                 Number of CPUs
      --vm-gpu-kind string          If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb, l40s, a10, none)
      --vm-gpus int                 Number of GPUs. Must also choose the GPU model with --vm-gpu-kind flag
      --vm-memory string            Memory (in megabytes) to attribute to the VM
      --vm-size string              The VM size to set machines to. See "fly platform vm-sizes" for valid values
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly volumes](/docs/flyctl/volumes/)	 - Manage Fly Volumes.

