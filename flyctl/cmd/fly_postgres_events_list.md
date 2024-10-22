Outputs a formatted list of cluster events


## Usage
~~~
fly postgres events list [flags]
~~~

## Options

~~~
  -o, --all                Outputs all entries
  -a, --app string         Application name
  -d, --compact            Omit the 'Details' column
  -c, --config string      Path to application configuration file
  -e, --event string       Event type in a postgres cluster
  -h, --help               help for list
  -l, --limit string       Set the maximum number of entries to output (default: 20)
  -i, --node-id string     Restrict entries to node with this ID
  -n, --node-name string   Restrict entries to node with this name
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly postgres events](/docs/flyctl/postgres-events/)	 - Track major cluster events

