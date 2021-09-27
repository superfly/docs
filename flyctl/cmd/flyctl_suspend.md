# _flyctl suspend_

Suspend an application

### About

The SUSPEND command will suspend an application. 
All instances will be halted leaving the application running nowhere.
It will continue to consume networking resources (IP address). See RESUME
for details on restarting it.

### Usage
~~~
flyctl suspend [APPNAME] [flags]
~~~

### Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for suspend
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

