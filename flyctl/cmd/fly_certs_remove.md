Removes a certificate from an application. Takes hostname
as a parameter to locate the certificate.

Use --custom to remove only the custom certificate while keeping ACME certificates.
Use --acme to stop ACME certificate issuance while keeping custom certificates.

## Usage
~~~
fly certs remove <hostname> [flags]
~~~

## Options

~~~
      --acme            Stop ACME certificate issuance, keeping custom certificates
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --custom          Remove only the custom certificate, keeping ACME certificates
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

* [fly certs](/docs/flyctl/certs/)	 - Manage certificates

