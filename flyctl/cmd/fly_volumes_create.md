Create a new volume for an app. Volumes are persistent storage for Fly Machines. Learn how to add a volume to your app: https://fly.io/docs/launch/volume-storage/.

## Usage
~~~
fly volumes create <volume name> [flags]
~~~

## Options

~~~
  -a, --app string                  Application name
  -c, --config string               Path to application configuration file
  -n, --count int                   The number of volumes to create (default 1)
  -h, --help                        help for create
      --host-dedication-id string   The dedication id of the reserved hosts for your organization (if any)
  -j, --json                        JSON output
      --no-encryption               Do not encrypt the volume contents. Volume contents are encrypted by default.
  -r, --region string               The target region (see 'flyctl platform regions')
      --require-unique-zone         Place the volume in a separate hardware zone from existing volumes to help ensure availability (default true)
  -s, --size int                    The size of volume in gigabytes (default 1)
      --snapshot-id string          Create the volume from the specified snapshot
      --snapshot-retention int      Snapshot retention in days (default 5)
      --vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                 Number of CPUs
      --vm-gpu-kind string          If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb, l40s, a10, none)
      --vm-gpus int                 Number of GPUs. Must also choose the GPU model with --vm-gpu-kind flag
      --vm-memory string            Memory (in megabytes) to attribute to the VM
      --vm-size string              The VM size to set machines to. See "fly platform vm-sizes" for valid values
  -y, --yes                         Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly volumes](/docs/flyctl/volumes/)	 - Manage Fly Volumes.

