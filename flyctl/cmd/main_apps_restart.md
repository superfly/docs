Restart an application. Perform a rolling restart against all running Machines.

## Usage
~~~
main apps restart <app name> [flags]
~~~

## Options

~~~
      --force-stop           Performs a force stop against the target Machine
  -h, --help                 help for restart
      --skip-health-checks   Restarts app without waiting for health checks
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [main apps](/docs/flyctl/main-apps/)	 - Manage apps.

