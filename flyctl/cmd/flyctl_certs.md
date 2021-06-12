# _flyctl certs_

Manage certificates

### About

Manages the certificates associated with a deployed application. 
Certificates are created by associating a hostname/domain with the application. 
When Fly is then able to validate that hostname/domain, the platform gets 
certificates issued for the hostname/domain by Let's Encrypt.

### Usage
```
flyctl certs [command] [flags]
```

### Available Commands
* [add](/docs/flyctl/certs-add/)	 - Add a certificate for an App.
* [check](/docs/flyctl/certs-check/)	 - Checks DNS configuration
* [list](/docs/flyctl/certs-list/)	 - List certificates for an App.
* [remove](/docs/flyctl/certs-remove/)	 - Removes a certificate from an App
* [show](/docs/flyctl/certs-show/)	 - Shows certificate information

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for certs
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI
* [flyctl](/docs/flyctl/domains/)	 - Domains on Fly

