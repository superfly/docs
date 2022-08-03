Set one or more encrypted secrets for an application. Values are read from stdin as NAME=VALUE pairs

## Usage
~~~
flyctl secrets import [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for import
      --stage           Import secrets but skip deployment (only for Machine apps)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl secrets](/docs/flyctl/secrets/)	 - Manage application secrets with the set and unset commands.

