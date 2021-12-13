The `suspend` command will suspend an application. All instances will be halted leaving the application running nowhere. It will continue to consume networking resources (IP address). See `apps resume` for details on restarting it.

## Usage

~~~
flyctl suspend [APPNAME] [flags]
~~~

## Options

~~~
  -h, --help   help for suspend
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

