Create a new PostgreSQL cluster


## Usage
~~~
flyctl postgres create [flags]
~~~

## Options

~~~
      --consul-url string          Opt into using an existing consul as the backend store by specifying the target consul url.
      --detach                     Return immediately instead of monitoring deployment progress
  -h, --help                       help for create
      --initial-cluster-size int   Initial cluster size
      --machines                   Create postgres cluster on fly machines (default true)
  -n, --name string                The name of your Postgres app
      --nomad                      Create postgres cluster on Nomad
  -o, --org string                 The target Fly organization
  -p, --password string            The superuser password. The password will be generated for you if you leave this blank
  -r, --region string              The target region (see 'flyctl platform regions')
      --repmgr                     Create a postgres cluster on top of fly machines that is managed by Repmgr. ( Experimental )
      --snapshot-id string         Creates the volume with the contents of the snapshot
      --vm-size string             the size of the VM
      --volume-size int            The volume size in GB
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

