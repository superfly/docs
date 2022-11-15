The APPS RESTART command will perform a rolling restart against all running VMs

## Usage
~~~
flyctl apps restart [APPNAME] [flags]
~~~

## Options

~~~
      --force-stop           Performs a force stop against the target Machine. ( Machines only )
  -h, --help                 help for restart
      --skip-health-checks   Restarts app without waiting for health checks. ( Machines only )
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl apps](/docs/flyctl/apps/)	 - Manage apps

