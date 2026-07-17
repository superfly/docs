Import a custom TLS certificate for a hostname.

Upload your own certificate and private key in PEM format. Requires domain
ownership verification via DNS before the certificate becomes active.

## Usage
~~~
fly certs import <hostname> [flags]
~~~

## Options

~~~
  -a, --app string           Application name
  -c, --config string        Path to application configuration file
      --fullchain string     Path to certificate chain file (PEM format)
  -h, --help                 help for import
  -j, --json                 JSON output
      --private-key string   Path to private key file (PEM format)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly certs](/docs/flyctl/certs/)	 - Manage certificates

