Update an existing MySQL database


## Usage
~~~
fly mysql update <database_name> [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --cpu int         The number of CPUs assigned to each cluster member
  -h, --help            help for update
      --memory int      Memory (in GB) assigned to each cluster member
  -o, --org string      The target Fly.io organization
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

* [fly mysql](/docs/flyctl/mysql/)	 - Provision and manage MySQL database clusters

