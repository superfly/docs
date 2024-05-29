Renews the SSH certificates for the Postgres cluster. This is useful when the certificates have expired or need to be rotated.

## Usage
~~~
fly postgres renew-certs [flags]
~~~

## Options

~~~
  -a, --app string       Application name
  -c, --config string    Path to application configuration file
  -h, --help             help for renew-certs
      --valid-days int   The number of days the certificate should be valid for. (default 36525)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

