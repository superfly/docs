The APPS commands focus on managing your Fly applications.
Start with the CREATE command to register your application.
The LIST command will list all currently registered applications.


## Usage
~~~
flyctl apps [command] [flags]
~~~

## Available Commands
* [create](/docs/flyctl/apps-create/)	 - Create a new application
* [destroy](/docs/flyctl/apps-destroy/)	 - Permanently destroys an app
* [list](/docs/flyctl/apps-list/)	 - List applications
* [move](/docs/flyctl/apps-move/)	 - Move an app to another organization
* [open](/docs/flyctl/apps-open/)	 - Open browser to current deployed application
* [releases](/docs/flyctl/apps-releases/)	 - List app releases
* [restart](/docs/flyctl/apps-restart/)	 - Restart an application

## Options

~~~
  -h, --help   help for apps
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

