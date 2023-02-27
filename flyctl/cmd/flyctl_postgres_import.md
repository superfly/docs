Imports database from a specified Postgres URI


## Usage
~~~
flyctl postgres import <source-uri> [flags]
~~~

## Options

~~~
  -a, --app string       Application name
      --clean            Drop database objects prior to creating them.
  -c, --config string    Path to application configuration file
      --create           Begin by creating the database itself and reconnecting to it. If --clean is also specified, the script drops and recreates the target database before reconnecting to it. (default true)
      --data-only        Dump only the data, not the schema (data definitions).
  -h, --help             help for import
      --image string     Path to public image containing custom migration process
      --no-owner         Do not set ownership of objects to match the original database. Makes dump restorable by any user. (default true)
      --region string    Region to provision migration machine
      --vm-size string   the size of the VM
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl postgres](/docs/flyctl/postgres/)	 - Manage Postgres clusters.

