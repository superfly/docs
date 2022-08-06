## DEPRECATED
This command is deprecated. 
You may still resume suspended apps using:
~~~
flyctl resume
~~~
If you need to stop an app temporarily use:
~~~
flyctl scale count 0
~~~

---

The SUSPEND command will suspend an application.
All instances will be halted leaving the application running nowhere.
It will continue to consume networking resources (IP address). See APPS RESUME
for details on restarting it.


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

