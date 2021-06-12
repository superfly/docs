# _flyctl config_

Manage an Apps configuration

### About

The CONFIG commands allow you to work with an application's configuration.

### Usage
```
flyctl config [command] [flags]
```

### Available Commands
* [display](/docs/flyctl/config-display/)	 - Display an App's configuration
* [env](/docs/flyctl/config-env/)	 - Display an app's runtime environment variables
* [save](/docs/flyctl/config-save/)	 - Save an App's config file
* [validate](/docs/flyctl/config-validate/)	 - Validate an App's config file

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for config
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

