Change an application's VM size to one of the named VM sizes.

For a full list of supported sizes use the command 'flyctl platform vm-sizes'

Memory size can be set with --memory=number-of-MB
e.g. flyctl scale vm shared-cpu-1x --memory=2048

For pricing, see https://fly.io/docs/about/pricing/

## Usage
~~~
flyctl scale vm [size] [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
      --group string    The process group to apply the VM size to
  -h, --help            help for vm
      --vm-memory int   Memory in MB for the VM
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl scale](/docs/flyctl/scale/)	 - Scale app resources

