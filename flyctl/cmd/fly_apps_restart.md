Restart an application. Perform a rolling restart against all running Machines.

## Usage
~~~
fly apps restart <app name> [flags]
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

* [fly apps](/docs/flyctl/apps/)	 - Manage apps.

