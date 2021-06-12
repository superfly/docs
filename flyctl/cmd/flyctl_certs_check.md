# _flyctl certs check_

Checks DNS configuration

### About

Checks the DNS configuration for the specified hostname. 
Displays results in the same format as the SHOW command.

### Usage
```
flyctl certs check <hostname> [flags]
```

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for check
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl certs](/docs/flyctl/certs/)	 - Manage certificates
* [flyctl](/docs/flyctl/domains/)	 - Domains on Fly
