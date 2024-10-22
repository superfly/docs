Issue a new SSH credential. With -agent, populate credential
into SSH agent. With -hour, set the number of hours (1-72) for credential
validity.

## Usage
~~~
fly ssh issue [org] [path] [flags]
~~~

## Options

~~~
      --agent              Add key to SSH agent
  -d, --dotssh             Store keys in ~/.ssh, like normal keys
  -h, --help               help for issue
      --hours int          Expiration, in hours (<72) (default 24)
  -o, --org string         The target Fly.io organization
      --overwrite          Overwrite existing SSH keys in same location, if we generated them
  -u, --username strings   Unix usernames the SSH cert can authenticate as (default [root,fly])
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly ssh](/docs/flyctl/ssh/)	 - Use SSH to log into or run commands on Machines

