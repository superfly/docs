This is flyctl, the Fly.io command line interface.

## Usage
~~~
main [flags]
~~~

## Available Commands
* [agent](/docs/flyctl/main-agent/)	 - Commands that manage the Fly agent, a background process that manages flyctl wireguard connections
* [apps](/docs/flyctl/main-apps/)	 - Manage apps.
* [auth](/docs/flyctl/main-auth/)	 - Manage authentication
* [certs](/docs/flyctl/main-certs/)	 - Manage certificates
* [checks](/docs/flyctl/main-checks/)	 - Manage health checks
* [config](/docs/flyctl/main-config/)	 - Manage an app's configuration
* [console](/docs/flyctl/main-console/)	 - Run a console in a new or existing machine
* [consul](/docs/flyctl/main-consul/)	 - Enable and manage Consul clusters
* [dashboard](/docs/flyctl/main-dashboard/)	 - Open web browser on Fly Web UI for this app
* [deploy](/docs/flyctl/main-deploy/)	 - Deploy Fly applications
* [dig](/docs/flyctl/main-dig/)	 - Make DNS requests against Fly.io's internal DNS server
* [docs](/docs/flyctl/main-docs/)	 - View Fly documentation
* [doctor](/docs/flyctl/main-doctor/)	 - The DOCTOR command allows you to debug your Fly environment
* [extensions](/docs/flyctl/main-extensions/)	 - Extensions are additional functionality that can be added to your Fly apps
* [image](/docs/flyctl/main-image/)	 - Manage app image
* [incidents](/docs/flyctl/main-incidents/)	 - Show incidents
* [ips](/docs/flyctl/main-ips/)	 - Manage IP addresses for apps
* [jobs](/docs/flyctl/main-jobs/)	 - Show jobs at Fly.io
* [launch](/docs/flyctl/main-launch/)	 - Create and configure a new app from source code or a Docker image
* [litefs-cloud](/docs/flyctl/main-litefs-cloud/)	 - LiteFS Cloud management commands
* [logs](/docs/flyctl/main-logs/)	 - View app logs
* [machine](/docs/flyctl/main-machine/)	 - Manage Fly Machines.
* [mysql](/docs/flyctl/main-mysql/)	 - Provision and manage MySQL database clusters
* [orgs](/docs/flyctl/main-orgs/)	 - Commands for managing Fly organizations
* [ping](/docs/flyctl/main-ping/)	 - Test connectivity with ICMP ping messages
* [platform](/docs/flyctl/main-platform/)	 - Fly platform information
* [postgres](/docs/flyctl/main-postgres/)	 - Manage Postgres clusters.
* [proxy](/docs/flyctl/main-proxy/)	 - Proxies connections to a Fly Machine.
* [redis](/docs/flyctl/main-redis/)	 - Launch and manage Redis databases managed by Upstash.com
* [releases](/docs/flyctl/main-releases/)	 - List app releases
* [scale](/docs/flyctl/main-scale/)	 - Scale app resources
* [secrets](/docs/flyctl/main-secrets/)	 - Manage application secrets with the set and unset commands.
* [services](/docs/flyctl/main-services/)	 - Show the application's services
* [settings](/docs/flyctl/main-settings/)	 - Manage flyctl settings
* [sftp](/docs/flyctl/main-sftp/)	 - Get or put files from a remote VM.
* [ssh](/docs/flyctl/main-ssh/)	 - Use SSH to log into or run commands on Machines
* [status](/docs/flyctl/main-status/)	 - Show app status
* [storage](/docs/flyctl/main-storage/)	 - Provision and manage Tigris object storage buckets
* [synthetics](/docs/flyctl/main-synthetics/)	 - Synthetic monitoring
* [tokens](/docs/flyctl/main-tokens/)	 - Manage Fly.io API tokens
* [version](/docs/flyctl/main-version/)	 - Show version information for the flyctl command
* [volumes](/docs/flyctl/main-volumes/)	 - Manage Fly Volumes.
* [wireguard](/docs/flyctl/main-wireguard/)	 - Commands that manage WireGuard peer connections

## Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
  -h, --help                  help for main
      --verbose               Verbose output
~~~

## See Also


