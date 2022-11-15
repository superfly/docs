The APPS RESTART command will perform a rolling restart against all running VM's

## Usage
~~~
flyctl restart [APPNAME] [flags]
~~~

## Options

~~~
  -f, --force                Will issue a restart against each Machine even if there are errors. ( Machines only )
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

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

