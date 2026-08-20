Update an Upstash Redis database

## Usage
~~~
fly redis update <name> [flags]
~~~

## Options

~~~
      --disable-prodpack         Disable the ProdPack add-on
      --enable-prodpack          Enable ProdPack add-on for additional features ($200/mo)
  -h, --help                     help for update
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

