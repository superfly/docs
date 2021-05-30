# _flyctl volumes_

Volume management commands

### About

Commands for managing Fly Volumes associated with an application.

### Usage
```
flyctl volumes [command] [flags]
```

### Available Commands
* [create](/docs/flyctl/volumes-create/)	 - Create new volume for app
* [delete](/docs/flyctl/volumes-delete/)	 - Delete a volume from the app
* [list](/docs/flyctl/volumes-list/)	 - List the volumes for app
* [show](/docs/flyctl/volumes-show/)	 - Show details of an app's volume

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for volumes
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

