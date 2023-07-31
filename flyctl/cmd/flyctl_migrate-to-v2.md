Migrates an Apps V1 (Nomad) app to the Apps V2 (machines) platform

## Usage
~~~
flyctl migrate-to-v2 [flags]
~~~

## Available Commands
* [troubleshoot](/docs/flyctl/migrate-to-v2-troubleshoot/)	 - Troubleshoot an app that has been migrated to Apps V2

## Options

~~~
  -c, --config string           Path to application configuration file
  -h, --help                    help for migrate-to-v2
      --primary-region string   Specify primary region if one is not set in fly.toml
      --use-local-config        Use local fly.toml. Do not attempt to remotely fetch the app configuration from the latest deployed release
  -y, --yes                     Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

