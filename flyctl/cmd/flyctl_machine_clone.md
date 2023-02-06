Clone a Fly machine


## Usage
~~~
flyctl machine clone <machine_id> [flags]
~~~

## Options

~~~
  -a, --app string             Application name
      --attach-volume string   Existing volume to attach to the new machine
      --clear-auto-destroy     Disable auto destroy setting on new machine
      --clear-cmd              Set empty CMD on the new machine so it uses default CMD for the image
  -c, --config string          Path to application configuration file
      --from-snapshot string   Clone attached volumes and restore from snapshot, use 'last' for most recent snapshot. The default is an empty volume
  -h, --help                   help for clone
      --name string            Optional name for the new machine
      --override-cmd string    Set CMD on the new machine to this value
      --process-group string   For machines that are part of Fly Apps v2 does a regular clone and changes the process group to what is specified here
      --region string          Target region for the new machine
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl machine](/docs/flyctl/machine/)	 - Commands that manage machines

