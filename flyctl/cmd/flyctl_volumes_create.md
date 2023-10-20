Create a new volume for an app. Volumes are persistent storage for
		Fly Machines. The default size is 3 GB. Learn how to add a volume to
		your app: https://fly.io/docs/apps/volume-storage/

## Usage
~~~
flyctl volumes create <volumename> [flags]
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
      --require-unique-zone         Place the volume in a separate hardware zone from existing volumes. This is the default. (default true)
  -s, --size int                    The size of volume in gigabytes. The default is 3. (default 3)
      --snapshot-id string          Create the volume from the specified snapshot
      --vm-cpu-kind string          The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                 Number of CPUs
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

* [flyctl volumes](/docs/flyctl/volumes/)	 - Manage Fly Volumes.

