The Fly agent is a background process that manages wireguard connections started by flyctl.
Commands such as 'fly ssh' and 'fly proxy' use this agent.
Generally, the agent starts and stops automatically. These commands are useful for debugging.


## Usage
~~~
main agent [command] [flags]
~~~

## Available Commands
* [ping](/docs/flyctl/main-agent-ping/)	 - Ping the Fly agent
* [restart](/docs/flyctl/main-agent-restart/)	 - Restart the Fly agent
* [run](/docs/flyctl/main-agent-run/)	 - Run the Fly agent in the foreground
* [start](/docs/flyctl/main-agent-start/)	 - Start the Fly agent
* [stop](/docs/flyctl/main-agent-stop/)	 - Stop the Fly agent

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

* [main](/docs/flyctl/main/)	 - The Fly.io command line interface

