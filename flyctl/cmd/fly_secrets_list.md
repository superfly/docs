List the secrets available to the application. It shows each secret's
name, a digest of its value and the time the secret was last set. The
actual value of the secret is only available to the application.

## Usage
~~~
fly secrets list [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for list
  -j, --json            JSON output
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly secrets](/docs/flyctl/secrets/)	 - Manage application secrets with the set and unset commands.

