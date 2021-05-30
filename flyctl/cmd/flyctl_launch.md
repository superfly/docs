# _flyctl launch_

Launch a new app

### About

Create and configure a new app from source code or an image reference.

### Usage
```
flyctl launch [flags]
```

### Options

```
  -h, --help            help for launch
      --image string    the image to launch
      --name string     the name of the new app
      --org string      the organization that will own the app
      --path string     path to app code and where a fly.toml file will be saved. (default ".")
      --region string   the region to launch the new app in
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

