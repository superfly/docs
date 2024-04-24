Launch and manage Redis databases managed by Upstash.com

## Usage
~~~
fly redis [command] [flags]
~~~

## Available Commands
* [connect](/docs/flyctl/redis-connect/)	 - Connect to a Redis database using redis-cli
* [create](/docs/flyctl/redis-create/)	 - Create an Upstash Redis database
* [dashboard](/docs/flyctl/redis-dashboard/)	 - View your Upstash Redis databases on the Upstash web console
* [destroy](/docs/flyctl/redis-destroy/)	 - Permanently destroy an Upstash Redis database
* [list](/docs/flyctl/redis-list/)	 - List Upstash Redis databases for an organization
* [plans](/docs/flyctl/redis-plans/)	 - List available Redis plans
* [proxy](/docs/flyctl/redis-proxy/)	 - Proxy to a Redis database
* [reset](/docs/flyctl/redis-reset/)	 - Reset the password for an Upstash Redis database
* [status](/docs/flyctl/redis-status/)	 - Show status of a Redis database
* [update](/docs/flyctl/redis-update/)	 - Update an Upstash Redis database

## Options

~~~
  -h, --help   help for redis
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

