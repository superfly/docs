Configure the region placement rules for an application.

## Usage
~~~
flyctl regions [command] [flags]
~~~

## Available Commands
* [add](/docs/flyctl/regions-add/)	 - Allow the app to run in the provided regions
* [backup](/docs/flyctl/regions-backup/)	 - Sets the backup region pool with provided regions
* [list](/docs/flyctl/regions-list/)	 - Shows the list of regions the app is allowed to run in
* [remove](/docs/flyctl/regions-remove/)	 - Prevent the app from running in the provided regions
* [set](/docs/flyctl/regions-set/)	 - Sets the region pool with provided regions

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for regions
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

