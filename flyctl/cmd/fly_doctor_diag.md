Send diagnostic information about your applications back to Fly.io,
to help diagnose problems.

This command will collect some local system information and a few files
that you'd be sending us anyways in order to deploy, notably any Dockerfiles
you might have associated with this application.


## Usage
~~~
fly doctor diag [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --force           Send diagnostics even if we can't find your local Fly.io app
  -h, --help            help for diag
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly doctor](/docs/flyctl/doctor/)	 - The DOCTOR command allows you to debug your Fly environment

