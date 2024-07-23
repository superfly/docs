Allocates an IPv6 address to the application

## Usage
~~~
fly ips allocate-v6 [flags]
~~~

## Options

~~~
  -a, --app string       Application name
  -c, --config string    Path to application configuration file
  -h, --help             help for allocate-v6
      --network string   Target network name for a Flycast private IPv6 address
  -o, --org string       The target Fly.io organization
      --private          Allocate a private IPv6 address
  -r, --region string    The target region (see 'flyctl platform regions')
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly ips](/docs/flyctl/ips/)	 - Manage IP addresses for apps

