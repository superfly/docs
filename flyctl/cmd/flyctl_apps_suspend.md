# _flyctl apps suspend_

Suspend an application

### About

The APPS SUSPEND command will suspend an application. 
All instances will be halted leaving the application running nowhere.
It will continue to consume networking resources (IP address). See APPS RESUME
for details on restarting it.

### Usage
```
flyctl apps suspend [APPNAME] [flags]
```

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for suspend
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl apps](/docs/flyctl/apps/)	 - Manage Apps

