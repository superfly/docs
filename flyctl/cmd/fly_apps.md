The APPS commands focus on managing your Fly applications.
Start with the CREATE command to register your application.
The LIST command will list all currently registered applications.


## Usage
~~~
fly apps [command] [flags]
~~~

## Available Commands
* [create](/docs/flyctl/fly-apps-create/)	 - Create a new application
* [destroy](/docs/flyctl/fly-apps-destroy/)	 - Permanently destroys an app
* [errors](/docs/flyctl/fly-apps-errors/)	 - View application errors on Sentry.io
* [list](/docs/flyctl/fly-apps-list/)	 - List applications
* [move](/docs/flyctl/fly-apps-move/)	 - Move an app to another organization
* [open](/docs/flyctl/fly-apps-open/)	 - Open browser to current deployed application
* [releases](/docs/flyctl/fly-apps-releases/)	 - List app releases
* [restart](/docs/flyctl/fly-apps-restart/)	 - Restart an application

## Options

~~~
  -h, --help   help for apps
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/fly/)	 - The Fly.io command line interface

