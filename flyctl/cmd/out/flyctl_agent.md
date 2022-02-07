The Fly agent is a background process that manages wireguard connections started by flyctl.
Commands such as 'fly ssh' and 'fly proxy' use this agent.
Generally, the agent starts and stops automatically. These commands are useful for debugging.


## Usage
~~~
flyctl agent [command] [flags]
~~~

## Available Commands
* [ping](/docs/flyctl/agent-ping/)	 - Ping the Fly agent
* [restart](/docs/flyctl/agent-restart/)	 - Restart the Fly agent
* [run](/docs/flyctl/agent-run/)	 - Run the Fly agent in the foreground
* [start](/docs/flyctl/agent-start/)	 - Start the Fly agent
* [stop](/docs/flyctl/agent-stop/)	 - Stop the Fly agent

## Options

~~~
  -h, --help   help for agent
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

