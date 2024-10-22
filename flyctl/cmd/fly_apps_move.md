Move an application to another
organization the current user belongs to.
For details, see https://fly.io/docs/apps/move-app-org/.

## Usage
~~~
fly apps move <app name> [flags]
~~~

## Options

~~~
  -h, --help                 help for move
  -o, --org string           The target Fly.io organization
      --skip-health-checks   Update machines without waiting for health checks
  -y, --yes                  Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly apps](/docs/flyctl/apps/)	 - Manage apps.

