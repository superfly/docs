The APPS RESTART command will perform a rolling restart against all running VMs

## Usage
~~~
flyctl apps restart [APPNAME] [flags]
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

* [flyctl apps](/docs/flyctl/apps/)	 - Manage apps

