Manage Fly Volumes. Volumes are persistent storage for Fly Machines. Learn how how volumes work: https://fly.io/docs/volumes/overview/.

## Usage
~~~
main volumes [command] [flags]
~~~

## Available Commands
* [create](/docs/flyctl/main-volumes-create/)	 - Create a new volume for an app.
* [destroy](/docs/flyctl/main-volumes-destroy/)	 - Destroy one or more volumes.
* [extend](/docs/flyctl/main-volumes-extend/)	 - Extend a volume to the specified size.
* [fork](/docs/flyctl/main-volumes-fork/)	 - Fork the specified volume.
* [list](/docs/flyctl/main-volumes-list/)	 - List the volumes associated with an app.
* [show](/docs/flyctl/main-volumes-show/)	 - Show the details of the specified volume.
* [snapshots](/docs/flyctl/main-volumes-snapshots/)	 - Manage volume snapshots.
* [update](/docs/flyctl/main-volumes-update/)	 - Update a volume for an app.

## Options

~~~
  -h, --help   help for volumes
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [main](/docs/flyctl/main/)	 - The Fly.io command line interface

