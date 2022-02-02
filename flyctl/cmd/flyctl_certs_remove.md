Removes a certificate from an application. Takes hostname
as a parameter to locate the certificate.

## Usage
~~~
flyctl certs remove <hostname> [flags]
~~~

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for remove
  -y, --yes             accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl certs](/docs/flyctl/certs/)	 - Manage certificates

