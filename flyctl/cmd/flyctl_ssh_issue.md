Issue a new SSH credential. With -agent, populate credential
into SSH agent. With -hour, set the number of hours (1-72) for credential
validity.

## Usage
~~~
flyctl ssh issue [org] [email] [path] [flags]
~~~

## Options

~~~
      --agent             Add key to SSH agent
  -d, --dotssh            Store keys in ~/.ssh, like normal keys
  -h, --help              help for issue
      --hours int         Expiration, in hours (<72) (default 24)
  -o, --org string        The organization to operate on
      --overwrite         Overwrite existing SSH keys in same location, if we generated them
  -u, --username string   Unix username for SSH cert
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl ssh](/docs/flyctl/ssh/)	 - Use SSH to login to or run commands on VMs

