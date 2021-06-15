# _flyctl scale_

Scale App resources

### About

Scale application resources

### Usage
```
flyctl scale [command] [flags]
```

### Available Commands
* [count](/docs/flyctl/scale-count/)	 - Change an App's VM count to the given value
* [memory](/docs/flyctl/scale-memory/)	 - Set VM memory
* [show](/docs/flyctl/scale-show/)	 - Show current resources
* [vm](/docs/flyctl/scale-vm/)	 - Change an App's VM to a named size (eg. shared-cpu-1x, dedicated-cpu-1x, dedicated-cpu-2x...)

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for scale
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI
* [flyctl autoscale](/docs/flyctl/autoscale/)	 - Autoscaling App resources
* [Scaling and Autoscaling](/docs/reference/scaling/)	 - Guide to Scaling and Autoscaling

