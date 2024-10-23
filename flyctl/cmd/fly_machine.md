Manage Fly Machines. Fly Machines are super-fast, lightweight VMs that can be created,
and then quickly started and stopped as needed with flyctl commands or with the
Machines REST fly.

## Usage
~~~
fly machine [command] [flags]
~~~

## Available Commands
* [api-proxy](/docs/flyctl/machine-api-proxy/)	 - Establish a proxy to the Machine API through a Wireguard tunnel for local connections
* [clone](/docs/flyctl/machine-clone/)	 - Clone a Fly Machine
* [cordon](/docs/flyctl/machine-cordon/)	 - Deactivate all services on a machine
* [create](/docs/flyctl/machine-create/)	 - Create, but don't start, a machine
* [destroy](/docs/flyctl/machine-destroy/)	 - Destroy Fly machines
* [egress-ip](/docs/flyctl/machine-egress-ip/)	 - Manage static egress IPs
* [exec](/docs/flyctl/machine-exec/)	 - Execute a command on a machine
* [kill](/docs/flyctl/machine-kill/)	 - Kill (SIGKILL) a Fly machine
* [leases](/docs/flyctl/machine-leases/)	 - Manage machine leases
* [list](/docs/flyctl/machine-list/)	 - List Fly machines
* [restart](/docs/flyctl/machine-restart/)	 - Restart one or more Fly machines
* [run](/docs/flyctl/machine-run/)	 - Run a machine
* [start](/docs/flyctl/machine-start/)	 - Start one or more Fly machines
* [status](/docs/flyctl/machine-status/)	 - Show current status of a running machine
* [stop](/docs/flyctl/machine-stop/)	 - Stop one or more Fly machines
* [suspend](/docs/flyctl/machine-suspend/)	 - Suspend one or more Fly machines
* [uncordon](/docs/flyctl/machine-uncordon/)	 - Reactivate all services on a machine
* [update](/docs/flyctl/machine-update/)	 - Update a machine

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

* [fly](/docs/flyctl/help/)	 - The Fly.io command line interface

