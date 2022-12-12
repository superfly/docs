Allocates an IPv6 address to the application

## Usage
~~~
flyctl ips allocate-v6 [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for allocate-v6
  -o, --org string      The target Fly organization
      --private         Allocate a private IPv6 address
  -r, --region string   The target region (see 'flyctl platform regions')
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl ips](/docs/flyctl/ips/)	 - Manage IP addresses for apps

