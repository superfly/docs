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
  -j, --json             JSON output
      --name string      The app name to use
      --network string   Specify custom network id
  -o, --org string       The target Fly.io organization
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [flyctl apps](/docs/flyctl/apps/)	 - Manage apps

