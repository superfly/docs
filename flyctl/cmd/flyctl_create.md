The CREATE command will both register a new application
with the Fly platform and create the fly.toml file which controls how
the application will be deployed. The --builder flag allows a cloud native
buildpack to be specified which will be used instead of a Dockerfile to
create the application image when it is deployed.


## Usage
~~~
flyctl create [APPNAME] [flags]
~~~

## Options

~~~
      --generate-name    Generate a name for the app
  -h, --help             help for create
      --name string      The app name to use
      --network string   Specify custom network id
  -o, --org string       The organization to operate on
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

