List the secrets available to the application. It shows each secret's
name, a digest of its value and the deployment status across machines. The
actual value of the secret is only available to the application.

Secrets that need deployment are prefixed with an indicator:
  *  Staged secret (not deployed to any machines)
  !  Partial deployment (deployed to some but not all machines)

Deployment status:
  Deployed     - Secret is deployed to all machines (secret updated_at <= machine release created_at)
  Staged       - Secret is staged but not deployed to any machines
  Partial      - Secret is deployed to some but not all machines (rolling deployment in progress)
  Unknown      - Status cannot be determined (missing timestamps, too many machines, or API error)

## Usage
~~~
fly secrets list [flags]
~~~

## Options

~~~
  -a, --app string      Application name
  -c, --config string   Path to application configuration file
  -h, --help            help for list
  -j, --json            JSON output
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly secrets](/docs/flyctl/secrets/)	 - Manage application secrets with the set and unset commands.

