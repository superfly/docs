Create new volume for app. --region flag must be included to specify
region the volume exists in. --size flag is optional, defaults to 3,
sets the size as the number of gigabytes the volume will consume.

## Usage
~~~
flyctl volumes create <volumename> [flags]
~~~

## Options

~~~
  -a, --app string                  Application name
  -c, --config string               Path to application configuration file
  -n, --count int                   Number of volumes to create (default 1)
  -h, --help                        help for create
      --host-dedication-id string   
  -j, --json                        JSON output
      --no-encryption               Do not encrypt the volume contents
  -r, --region string               The target region (see 'flyctl platform regions')
      --require-unique-zone         Require volume to be placed in separate hardware zone from existing volumes (default true)
  -s, --size int                    Size of volume in gigabytes (default 3)
      --snapshot-id string          Create volume from a specified snapshot
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

* [flyctl volumes](/docs/flyctl/volumes/)	 - Volume management commands

