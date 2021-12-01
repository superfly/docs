# _flyctl ips_

Manage IP addresses for apps

### About

The IPS commands manage IP addresses for applications. An application
can have a number of IP addresses associated with it and this family of commands
allows you to list, allocate and release those addresses. It supports both IPv4
and IPv6 addresses.

### Usage
~~~
flyctl ips [command] [flags]
~~~

### Available Commands
* [allocate-v4](/docs/flyctl/ips-allocate-v4/)	 - Allocate an IPv4 address
* [allocate-v6](/docs/flyctl/ips-allocate-v6/)	 - Allocate an IPv6 address
* [list](/docs/flyctl/ips-list/)	 - List allocated IP addresses
* [private](/docs/flyctl/ips-private/)	 - List instances private IP addresses
* [release](/docs/flyctl/ips-release/)	 - Release an IP address

### Options

~~~
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for ips
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

