Log of all issued SSH certs. Each organization has a different root certificate.
This is used for members of the organization and its apps' instances. 

## Usage
~~~
flyctl ssh log [flags]
~~~

## Options

~~~
  -h, --help         help for log
  -o, --org string   The organization to operate on
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl ssh](/docs/flyctl/ssh/)	 - Use SSH to login to or run commands on VMs
* [flyctl ssh issue](/docs/flyctl/ssh-issue/)	 - Issue new SSH credential
