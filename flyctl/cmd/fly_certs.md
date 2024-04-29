Manages the certificates associated with a deployed application.
Certificates are created by associating a hostname/domain with the application.
When Fly is then able to validate that hostname/domain, the platform gets
certificates issued for the hostname/domain by Let's Encrypt.

## Usage
~~~
fly certs [command] [flags]
~~~

## Available Commands
* [add](/docs/flyctl/certs-add/)	 - Add a certificate for an app.
* [check](/docs/flyctl/certs-check/)	 - Checks DNS configuration
* [list](/docs/flyctl/certs-list/)	 - List certificates for an app.
* [remove](/docs/flyctl/certs-remove/)	 - Removes a certificate from an app
* [show](/docs/flyctl/certs-show/)	 - Shows certificate information

## Options

~~~
  -h, --help   help for certs
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

