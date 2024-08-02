Clone a Fly Machine. The new Machine will be a copy of the specified Machine. If the original Machine has a volume, then a new empty volume will be created and attached to the new Machine.

## Usage
~~~
fly machine clone [machine_id] [flags]
~~~

## Options

~~~
  -a, --app string                    Application name
      --attach-volume string          Existing volume to attach to the new Machine in the form of <volume_id>[:/path/inside/machine]
      --clear-auto-destroy            Disable auto destroy setting on the new Machine
      --clear-cmd                     Set empty CMD on the new Machine so it uses default CMD for the image
  -c, --config string                 Path to application configuration file
      --detach                        Return immediately instead of monitoring deployment progress
      --from-snapshot string          Clone attached volumes and restore from snapshot, use 'last' for most recent snapshot. The default is an empty volume.
  -h, --help                          help for clone
      --host-dedication-id string     The dedication id of the reserved hosts for your organization (if any)
      --name string                   Optional name for the new Machine
      --override-cmd string           Set CMD on the new Machine to this value
  -r, --region string                 The target region (see 'flyctl platform regions')
      --standby-for strings           Comma separated list of Machine IDs to watch for. You can use '--standby-for=source' to create a standby for the cloned Machine.
      --vm-cpu-kind string            The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                   Number of CPUs
      --vm-gpu-kind string            If set, the GPU model to attach (a100-pcie-40gb, a100-sxm4-80gb, l40s, a10, none)
      --vm-gpus int                   Number of GPUs. Must also choose the GPU model with --vm-gpu-kind flag
      --vm-memory string              Memory (in megabytes) to attribute to the VM
      --vm-size string                The VM size to set machines to. See "fly platform vm-sizes" for valid values
      --volume-requires-unique-zone   Require volume to be placed in separate hardware zone from existing volumes. Default true. (default true)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly machine](/docs/flyctl/machine/)	 - Manage Fly Machines.

