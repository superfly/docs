Create an Upstash Redis database

## Usage
~~~
fly redis create [flags]
~~~

## Options

~~~
      --disable-eviction         Disallow writes when the max data size limit has been reached
      --enable-eviction          Evict objects when memory is full
  -h, --help                     help for create
  -n, --name string              The name of your Redis database
      --no-replicas              Don't prompt for selecting replica regions
  -o, --org string               The target Fly.io organization
  -r, --region string            The target region (see 'flyctl platform regions')
      --replica-regions string   Comma-separated list of regions to deploy read replicas (see 'flyctl platform regions')
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly redis](/docs/flyctl/redis/)	 - Launch and manage Redis databases managed by Upstash.com

