Manage Fly Machines. Fly Machines are super-fast, lightweight VMs that can be created,
and then quickly started and stopped as needed with flyctl commands or with the
Machines REST fly.

## Usage
~~~
fly machine [command] [flags]
~~~

## Available Commands
* [api-proxy](/docs/flyctl/fly-machine-api-proxy/)	 - Establish a proxy to the Machine API through a Wireguard tunnel for local connections
* [clone](/docs/flyctl/fly-machine-clone/)	 - Clone a Fly Machine.
* [cordon](/docs/flyctl/fly-machine-cordon/)	 - Deactivate all services on a machine
* [create](/docs/flyctl/fly-machine-create/)	 - Create, but don't start, a machine
* [destroy](/docs/flyctl/fly-machine-destroy/)	 - Destroy Fly machines
* [exec](/docs/flyctl/fly-machine-exec/)	 - Execute a command on a machine
* [kill](/docs/flyctl/fly-machine-kill/)	 - Kill (SIGKILL) a Fly machine
* [leases](/docs/flyctl/fly-machine-leases/)	 - Manage machine leases
* [list](/docs/flyctl/fly-machine-list/)	 - List Fly machines
* [restart](/docs/flyctl/fly-machine-restart/)	 - Restart one or more Fly machines
* [run](/docs/flyctl/fly-machine-run/)	 - Run a machine
* [start](/docs/flyctl/fly-machine-start/)	 - Start one or more Fly machines
* [status](/docs/flyctl/fly-machine-status/)	 - Show current status of a running machine
* [stop](/docs/flyctl/fly-machine-stop/)	 - Stop one or more Fly machines
* [uncordon](/docs/flyctl/fly-machine-uncordon/)	 - Reactivate all services on a machine
* [update](/docs/flyctl/fly-machine-update/)	 - Update a machine

## Options

~~~
  -h, --help   help for machine
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/fly/)	 - The Fly.io command line interface

