The SFTP FIND command lists files (from an optional root directory) on a remote VM.

## Usage
~~~
flyctl ssh sftp find [path] [flags]
~~~

## Options

~~~
  -A, --address string   Address of VM to connect to
  -a, --app string       Application name
  -C, --command string   command to run on SSH session
  -c, --config string    Path to application configuration file
  -h, --help             help for find
  -o, --org string       The target Fly organization
  -q, --quiet            Don't print progress indicators for WireGuard
  -r, --region string    Region to create WireGuard connection in
  -s, --select           select available instances
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl ssh sftp](/docs/flyctl/ssh-sftp/)	 - Get or put files from a remote VM.

