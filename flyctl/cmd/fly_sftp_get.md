The SFTP GET retrieves a file from a remote VM.

## Usage
~~~
fly sftp get <path> [flags]
~~~

## Options

~~~
  -A, --address string         Address of VM to connect to
  -a, --app string             Application name
  -C, --command string         command to run on SSH session
  -c, --config string          Path to application configuration file
  -h, --help                   help for get
      --machine string         Run the console in the existing machine with the specified ID
  -o, --org string             The target Fly.io organization
  -g, --process-group string   The target process group
      --pty                    Allocate a pseudo-terminal (default: on when no command is provided)
  -q, --quiet                  Don't print progress indicators for WireGuard
  -r, --region string          The target region (see 'flyctl platform regions')
  -s, --select                 select available instances
  -u, --user string            Unix username to connect as (default "root")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly sftp](/docs/flyctl/sftp/)	 - Get or put files from a remote VM.

