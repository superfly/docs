# _flyctl scale vm_

Change an App's VM to a named size (eg. shared-cpu-1x, dedicated-cpu-1x, dedicated-cpu-2x...)

### About

Change an application's VM size to one of the named VM sizes.

Size names include shared-cpu-1x, dedicated-cpu-1x, dedicated-cpu-2x.

For a full list of supported sizes use the command FLYCTL PLATFORM VM-SIZES

Memory size can be set with --memory=number-of-MB

e.g. flyctl scale vm shared-cpu-1x --memory=2048

For dedicated vms, this should be a multiple of 1024MB.

For shared vms, this can be 256MB or a a multiple of 1024MB.

For pricing, see https://fly.io/docs/about/pricing/

### Usage
```
flyctl scale vm [SIZENAME] [flags]
```

### Options

```
  -a, --app string      App name to operate on
  -c, --config string   Path to an app config file or directory containing one (default "./fly.toml")
  -h, --help            help for vm
      --memory int      Memory in MB for the VM
```

### Global Options

```
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also

* [flyctl scale](/docs/flyctl/scale/)	 - Scale App resources
* [flyctl autoscale](/docs/flyctl/autoscale/)	 - Autoscaling App resources
* [Scaling and Autoscaling](/docs/reference/scaling/)	 - Guide to Scaling and Autoscaling

