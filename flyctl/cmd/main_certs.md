Manages the certificates associated with a deployed application.
Certificates are created by associating a hostname/domain with the application.
When Fly is then able to validate that hostname/domain, the platform gets
certificates issued for the hostname/domain by Let's Encrypt.

## Usage
~~~
main certs [command] [flags]
~~~

## Available Commands
* [add](/docs/flyctl/main-certs-add/)	 - Add a certificate for an app.
* [check](/docs/flyctl/main-certs-check/)	 - Checks DNS configuration
* [list](/docs/flyctl/main-certs-list/)	 - List certificates for an app.
* [remove](/docs/flyctl/main-certs-remove/)	 - Removes a certificate from an app
* [show](/docs/flyctl/main-certs-show/)	 - Shows certificate information

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

* [main](/docs/flyctl/main/)	 - The Fly.io command line interface

