Secrets are provided to applications at runtime as ENV variables. Names are
		case sensitive and stored as-is, so ensure names are appropriate for
		the application and vm environment.
		

## Usage
~~~
fly secrets [command] [flags]
~~~

## Available Commands
* [deploy](/docs/flyctl/fly-secrets-deploy/)	 - Deploy staged secrets for an application
* [import](/docs/flyctl/fly-secrets-import/)	 - Set secrets as NAME=VALUE pairs from stdin
* [list](/docs/flyctl/fly-secrets-list/)	 - List application secret names, digests and creation times
* [set](/docs/flyctl/fly-secrets-set/)	 - Set one or more encrypted secrets for an application
* [unset](/docs/flyctl/fly-secrets-unset/)	 - Unset one or more encrypted secrets for an application

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

* [fly](/docs/flyctl/fly/)	 - The Fly.io command line interface

