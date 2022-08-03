Unset one or more encrypted secrets for an application

## Usage
~~~
flyctl secrets unset [flags] NAME NAME ...
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for unset
      --stage           Unset secrets but skip deployment (only for Machine apps)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl secrets](/docs/flyctl/secrets/)	 - Manage application secrets with the set and unset commands.

