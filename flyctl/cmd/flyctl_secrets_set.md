# _flyctl secrets set_

Set one or more encrypted secrets for an app

### About

Set one or more encrypted secrets for an application.

Secrets are provided to application at runtime as ENV variables. Names are
case sensitive and stored as-is, so ensure names are appropriate for
the application and vm environment.

Any value that equals "-" will be assigned from STDIN instead of args.

### Usage
~~~
flyctl secrets set [flags] NAME=VALUE NAME=VALUE ...
~~~

### Examples

~~~
flyctl secrets set FLY_ENV=production LOG_LEVEL=info
	echo "long text..." | flyctl secrets set LONG_TEXT=-
	flyctl secrets set FROM_A_FILE=- < file.txt
	
~~~

### Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
      --detach          Return immediately instead of monitoring deployment progress
  -h, --help            help for set
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl secrets](/docs/flyctl/secrets/)	 - Manage app secrets

