Removes a certificate from an application. Takes hostname
as a parameter to locate the certificate.

## Usage
~~~
main certs remove <hostname> [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for remove
  -y, --yes             Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [main certs](/docs/flyctl/main-certs/)	 - Manage certificates

