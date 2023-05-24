The SFTP GET retrieves a file from a remote VM.

## Usage
~~~
flyctl ssh sftp get <path> [flags]
~~~

## Options

~~~
  -A, --address string   Address of VM to connect to
  -a, --app string       Application name
  -C, --command string   command to run on SSH session
  -c, --config string    Path to application configuration file
  -h, --help             help for get
  -o, --org string       The target Fly organization
      --pty              Allocate a pseudo-terminal (default: on when no command is provided)
  -q, --quiet            Don't print progress indicators for WireGuard
  -r, --region string    Region to create WireGuard connection in
  -s, --select           select available instances
  -u, --user string      Unix username to connect as (default "root")
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl ssh sftp](/docs/flyctl/ssh-sftp/)	 - Get or put files from a remote VM.

