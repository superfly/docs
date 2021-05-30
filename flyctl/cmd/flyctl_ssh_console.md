# _flyctl ssh console_

Connect to a running instance of the current app.

### About

Connect to a running instance of the current app; with -select, choose instance from list.

### Usage
```
flyctl ssh console [<host>] [flags]
```

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for console
  -r, --region string   Region to create WireGuard connection in
  -s, --select          select available instances
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl ssh](/docs/flyctl/ssh/)	 - Commands that manage SSH credentials

