The APPS CREATE command will register a new application
with the Fly platform. It will not generate a configuration file, but one
may be fetched with 'fly config save -a <app_name>'

## Usage
~~~
flyctl apps create [APPNAME] [flags]
~~~

## Options

~~~
      --generate-name    Generate an app name
  -h, --help             help for create
      --machines         Use the machines platform
      --name string      The app name to use
      --network string   Specify custom network id
  -o, --org string       The target Fly organization
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl apps](/docs/flyctl/apps/)	 - Manage apps

