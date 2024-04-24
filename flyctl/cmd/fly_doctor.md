The DOCTOR command allows you to debug your Fly environment


## Usage
~~~
fly doctor [flags]
~~~

## Available Commands
* [diag](/docs/flyctl/doctor-diag/)	 - Send diagnostic information about your applications back to Fly.io.

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for doctor
  -j, --json            JSON output
  -o, --org string      The name of the organization to use for WireGuard tests. (default "personal")
  -v, --verbose         Print extra diagnostic information.
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

