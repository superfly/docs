# _flyctl autoscale balanced_

Configure a traffic balanced App with params (min=int max=int)

### About

Configure the App to balance regions based on traffic with given parameters:

min=int - minimum number of instances to be allocated from region pool. 
max=int - maximum number of instances to be allocated from region pool.

### Usage
```
flyctl autoscale balanced [flags]
```

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for balanced
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl autoscale](/docs/flyctl/autoscale/)	 - Autoscaling App resources

