Manage Fly Volumes. Volumes are persistent storage for Fly Machines. Learn how how volumes work: https://fly.io/docs/volumes/overview/.

## Usage
~~~
fly volumes [command] [flags]
~~~

## Available Commands
* [create](/docs/flyctl/volumes-create/)	 - Create a new volume for an app.
* [destroy](/docs/flyctl/volumes-destroy/)	 - Destroy one or more volumes.
* [extend](/docs/flyctl/volumes-extend/)	 - Extend a volume to the specified size.
* [fork](/docs/flyctl/volumes-fork/)	 - Fork the specified volume.
* [list](/docs/flyctl/volumes-list/)	 - List the volumes associated with an app.
* [show](/docs/flyctl/volumes-show/)	 - Show the details of the specified volume.
* [snapshots](/docs/flyctl/volumes-snapshots/)	 - Manage volume snapshots.
* [update](/docs/flyctl/volumes-update/)	 - Update a volume for an app.

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

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

