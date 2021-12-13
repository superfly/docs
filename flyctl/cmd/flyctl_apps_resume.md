The `apps resume` command will restart a previously suspended application. The application will resume with its original region pool and a min count of one meaning there will be one running instance once restarted. Use `scale set min=` to raise the number of configured instances.

## Usage

~~~
flyctl apps resume [APPNAME] [flags]
~~~

## Options

~~~
  -h, --help   help for resume
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl apps](/docs/flyctl/apps/)	 - Manage apps

