Manage Fly Machines. Fly Machines are super-fast, lightweight VMs that can be created,
and then quickly started and stopped as needed with flyctl commands or with the
Machines REST fly.

## Usage
~~~
main machine [command] [flags]
~~~

## Available Commands
* [api-proxy](/docs/flyctl/main-machine-api-proxy/)	 - Establish a proxy to the Machine API through a Wireguard tunnel for local connections
* [clone](/docs/flyctl/main-machine-clone/)	 - Clone a Fly Machine
* [cordon](/docs/flyctl/main-machine-cordon/)	 - Deactivate all services on a machine
* [create](/docs/flyctl/main-machine-create/)	 - Create, but don't start, a machine
* [destroy](/docs/flyctl/main-machine-destroy/)	 - Destroy Fly machines
* [egress-ip](/docs/flyctl/main-machine-egress-ip/)	 - Manage static egress IPs
* [exec](/docs/flyctl/main-machine-exec/)	 - Execute a command on a machine
* [kill](/docs/flyctl/main-machine-kill/)	 - Kill (SIGKILL) a Fly machine
* [leases](/docs/flyctl/main-machine-leases/)	 - Manage machine leases
* [list](/docs/flyctl/main-machine-list/)	 - List Fly machines
* [restart](/docs/flyctl/main-machine-restart/)	 - Restart one or more Fly machines
* [run](/docs/flyctl/main-machine-run/)	 - Run a machine
* [start](/docs/flyctl/main-machine-start/)	 - Start one or more Fly machines
* [status](/docs/flyctl/main-machine-status/)	 - Show current status of a running machine
* [stop](/docs/flyctl/main-machine-stop/)	 - Stop one or more Fly machines
* [suspend](/docs/flyctl/main-machine-suspend/)	 - Suspend one or more Fly machines
* [uncordon](/docs/flyctl/main-machine-uncordon/)	 - Reactivate all services on a machine
* [update](/docs/flyctl/main-machine-update/)	 - Update a machine

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

* [main](/docs/flyctl/main/)	 - The Fly.io command line interface

