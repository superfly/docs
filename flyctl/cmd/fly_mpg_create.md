Create a new Managed Postgres cluster


## Usage
~~~
fly mpg create [flags]
~~~

## Options

~~~
      --enable-postgis-support   Enable PostGIS for the Postgres cluster
  -h, --help                     help for create
  -n, --name string              The name of your Postgres cluster
  -o, --org string               The target Fly.io organization
      --pg-major-version int     The major version of Postgres to use for the Postgres cluster. Supported versions are 16 and 17. (default 16)
      --plan string              The plan to use for the Postgres cluster (development, production, etc)
  -r, --region string            The target region (see 'flyctl platform regions')
      --volume-size int          The volume size in GB (default 10)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly mpg](/docs/flyctl/mpg/)	 - Manage Managed Postgres clusters.

