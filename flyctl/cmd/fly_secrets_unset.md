Unset one or more encrypted secrets for an application

## Usage
~~~
fly secrets unset [flags] NAME NAME ...
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --detach          Return immediately instead of monitoring deployment progress
  -h, --help            help for unset
      --stage           Set secrets but skip deployment for machine apps
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly secrets](/docs/flyctl/secrets/)	 - Manage application secrets with the set and unset commands.

