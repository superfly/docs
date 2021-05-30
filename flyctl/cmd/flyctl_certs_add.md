# _flyctl certs add_

Add a certificate for an App.

### About

Add a certificate for an application. Takes a hostname 
as a parameter for the certificate.

### Usage
```
flyctl certs add <hostname> [flags]
```

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for add
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl certs](/docs/flyctl/certs/)	 - Manage certificates

