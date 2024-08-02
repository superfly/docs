Create a new Postgres cluster


## Usage
~~~
fly postgres create [flags]
~~~

## Options

~~~
      --autostart                  Automatically start a stopped Postgres app when a network request is received
      --consul-url string          Opt into using an existing consul as the backend store by specifying the target consul url.
      --detach                     Return immediately instead of monitoring deployment progress
      --enable-backups             Create a new tigris bucket and enable WAL-based backups
      --flex                       Create a postgres cluster that's managed by Repmgr (default true)
      --fork-from string           Specify a source Postgres application to fork from. Format: <app-name> or <app-name>:<volume-id>
  -h, --help                       help for create
      --image-ref string           Specify a non-default base image for the Postgres app
      --initial-cluster-size int   Initial cluster size
  -n, --name string                The name of your Postgres app
  -o, --org string                 The target Fly.io organization
  -p, --password string            The superuser password. The password will be generated for you if you leave this blank
  -r, --region string              The target region (see 'flyctl platform regions')
      --snapshot-id string         Creates the volume with the contents of the snapshot
      --stolon                     Create a postgres cluster that's managed by Stolon
      --vm-size string             the size of the VM
      --volume-size int            The volume size in GB
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

