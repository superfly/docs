The Fly agent is a background process that manages wireguard connections started by flyctl.
Commands such as 'fly ssh' and 'fly proxy' use this agent.
Generally, the agent starts and stops automatically. These commands are useful for debugging.


## Usage
~~~
fly agent [command] [flags]
~~~

## Available Commands
* [ping](/docs/flyctl/fly-agent-ping/)	 - Ping the Fly agent
* [restart](/docs/flyctl/fly-agent-restart/)	 - Restart the Fly agent
* [run](/docs/flyctl/fly-agent-run/)	 - Run the Fly agent in the foreground
* [start](/docs/flyctl/fly-agent-start/)	 - Start the Fly agent
* [stop](/docs/flyctl/fly-agent-stop/)	 - Stop the Fly agent

## Options

~~~
  -h, --help   help for agent
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly](/docs/flyctl/fly/)	 - The Fly.io command line interface

