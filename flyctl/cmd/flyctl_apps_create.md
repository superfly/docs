# _flyctl apps create_

Create a new application

### About

The APPS CREATE command will both register a new application 
with the Fly platform and create the fly.toml file which controls how 
the application will be deployed. The --builder flag allows a cloud native 
buildpack to be specified which will be used instead of a Dockerfile to 
create the application image when it is deployed.

### Usage
~~~
flyctl apps create [APPNAME] [flags]
~~~

### Options

~~~
      --generate-name   Always generate a name for the app
  -h, --help            help for create
      --name string     The app name to use
      --org string      The organization that will own the app
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl apps](/docs/flyctl/apps/)	 - Manage apps

