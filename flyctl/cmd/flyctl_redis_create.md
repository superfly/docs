Create an Upstash Redis database

## Usage
~~~
flyctl redis create [flags]
~~~

## Options

~~~
      --disable-eviction   Disallow writes when the max data size limit has been reached
      --enable-eviction    Evict objects when memory is full
  -h, --help               help for create
  -n, --name string        The name of your Redis database
      --no-replicas        No replica regions
  -o, --org string         The target Fly organization
      --plan string        Upstash Redis plan
  -r, --region string      The target region (see 'flyctl platform regions')
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl redis](/docs/flyctl/redis/)	 - Launch and manage Redis databases managed by Upstash.com

