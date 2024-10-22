Create a new application on the Fly platform.
This command won't generate a fly.toml configuration file, but you can
fetch one with 'fly config save -a <app_name>'.

## Usage
~~~
fly apps create <app name> [flags]
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

* [fly apps](/docs/flyctl/apps/)	 - Manage apps.

