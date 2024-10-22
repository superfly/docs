Provision a MySQL database


## Usage
~~~
fly extensions mysql create [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --cpu int         The number of CPUs assigned to each cluster member
      --disk int        Disk size (in GB) assigned to each cluster member
  -h, --help            help for create
      --memory int      Memory (in GB) assigned to each cluster member
  -n, --name string     The name of your database
  -o, --org string      The target Fly.io organization
  -r, --region string   The target region (see 'flyctl platform regions')
      --size int        The number of members in your cluster
  -y, --yes             Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly extensions mysql](/docs/flyctl/extensions-mysql/)	 - Provision and manage MySQL database clusters

