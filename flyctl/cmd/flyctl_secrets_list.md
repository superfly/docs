# _flyctl secrets list_

Lists the secrets available to the app

### About

List the secrets available to the application. It shows each
secret's name, a digest of the its value and the time the secret was last set.
The actual value of the secret is only available to the application.

### Usage
~~~
flyctl secrets list [flags]
~~~

### Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for list
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl secrets](/docs/flyctl/secrets/)	 - Manage app secrets

