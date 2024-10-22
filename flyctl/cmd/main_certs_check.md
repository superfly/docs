Checks the DNS configuration for the specified hostname.
Displays results in the same format as the SHOW command.

## Usage
~~~
main certs check <hostname> [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for check
  -j, --json            JSON output
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [main certs](/docs/flyctl/main-certs/)	 - Manage certificates

