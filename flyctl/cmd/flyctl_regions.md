V1 APPS ONLY (except 'regions list'): Configure the region placement rules for an application.

## Usage
~~~
flyctl regions [command] [flags]
~~~

## Available Commands
* [add](/docs/flyctl/regions-add/)	 - V1 APPS ONLY: Allow the app to run in the provided regions
* [backup](/docs/flyctl/regions-backup/)	 - V1 APPS ONLY: Sets the backup region pool with provided regions
* [list](/docs/flyctl/regions-list/)	 - Shows the list of regions the app is allowed to run in
* [remove](/docs/flyctl/regions-remove/)	 - V1 APPS ONLY: Prevent the app from running in the provided regions
* [set](/docs/flyctl/regions-set/)	 - V1 APPS ONLY: Sets the region pool with provided regions

## Options

~~~
  -h, --help   help for regions
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

