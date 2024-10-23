Secrets are provided to applications at runtime as ENV variables. Names are
		case sensitive and stored as-is, so ensure names are appropriate for
		the application and vm environment.
		

## Usage
~~~
main secrets [command] [flags]
~~~

## Available Commands
* [deploy](/docs/flyctl/main-secrets-deploy/)	 - Deploy staged secrets for an application
* [import](/docs/flyctl/main-secrets-import/)	 - Set secrets as NAME=VALUE pairs from stdin
* [list](/docs/flyctl/main-secrets-list/)	 - List application secret names, digests and creation times
* [set](/docs/flyctl/main-secrets-set/)	 - Set one or more encrypted secrets for an application
* [unset](/docs/flyctl/main-secrets-unset/)	 - Unset one or more encrypted secrets for an application

## Options

~~~
  -h, --help   help for secrets
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [main](/docs/flyctl/main/)	 - The Fly.io command line interface

