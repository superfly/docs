<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Manage app secrets
</p>

## About

Manage application secrets with the set and unset commands.

Secrets are provided to applications at runtime as ENV variables. Names are
case sensitive and stored as-is, so ensure names are appropriate for
the application and vm environment.

## Usage

~~~
flyctl secrets [command] [flags]
~~~

### Available Commands
* [import](/docs/flyctl/secrets-import/)	 - Read secrets in name=value from stdin
* [list](/docs/flyctl/secrets-list/)	 - Lists the secrets available to the app
* [set](/docs/flyctl/secrets-set/)	 - Set one or more encrypted secrets for an app
* [unset](/docs/flyctl/secrets-unset/)	 - Remove encrypted secrets from an app

## Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for secrets
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

