flyctl is a command line interface to the Fly.io platform.

It allows users to manage authentication, application launch,
deployment, network configuration, logging and more with just the
one command.

* Launch an app with the launch command
* Deploy an app with the deploy command
* View a deployed web application with the open command
* Check the status of an application with the status command

To read more, use the docs command to view Fly's help on the web.

## Usage
~~~
flyctl [command] [flags]
~~~

## Available Commands
* [agent](/docs/flyctl/agent/)	 - Commands that manage the Fly agent, a background process that manages flyctl wireguard connections
* [apps](/docs/flyctl/apps/)	 - Manage apps
* [auth](/docs/flyctl/auth/)	 - Manage authentication
* [autoscale](/docs/flyctl/autoscale/)	 - Autoscaling app resources
* [builds](/docs/flyctl/builds/)	 - Manage application builds
* [certs](/docs/flyctl/certs/)	 - Manage certificates
* [checks](/docs/flyctl/checks/)	 - Manage health checks
* [config](/docs/flyctl/config/)	 - Manage an app's configuration
* [create](/docs/flyctl/create/)	 - Create a new application
* [curl](/docs/flyctl/curl/)	 - Run a performance test against a URL
* [dashboard](/docs/flyctl/dashboard/)	 - Open web browser on Fly Web UI for this app
* [deploy](/docs/flyctl/deploy/)	 - Deploy Fly applications
* [destroy](/docs/flyctl/destroy/)	 - Permanently destroys an app
* [dig](/docs/flyctl/dig/)	 - Make DNS requests against Fly.io's internal DNS server
* [dns-records](/docs/flyctl/dns-records/)	 - Manage DNS records
* [docs](/docs/flyctl/docs/)	 - View Fly documentation
* [doctor](/docs/flyctl/doctor/)	 - The DOCTOR command allows you to debug your Fly environment
* [domains](/docs/flyctl/domains/)	 - Manage domains
* [history](/docs/flyctl/history/)	 - List an app's change history
* [image](/docs/flyctl/image/)	 - Manage app image
* [info](/docs/flyctl/info/)	 - Show detailed app information
* [ips](/docs/flyctl/ips/)	 - Manage IP addresses for apps
* [launch](/docs/flyctl/launch/)	 - Launch a new app
* [list](/docs/flyctl/list/)	 - Lists your Fly resources
* [logs](/docs/flyctl/logs/)	 - View app logs
* [machine](/docs/flyctl/machine/)	 - Commands that manage machines
* [monitor](/docs/flyctl/monitor/)	 - Monitor deployments
* [move](/docs/flyctl/move/)	 - Move an app to another organization
* [open](/docs/flyctl/open/)	 - Open browser to current deployed application
* [orgs](/docs/flyctl/orgs/)	 - Commands for managing Fly organizations
* [ping](/docs/flyctl/ping/)	 - Test connectivity with ICMP ping messages
* [platform](/docs/flyctl/platform/)	 - Fly platform information
* [postgres](/docs/flyctl/postgres/)	 - Manage postgres clusters
* [proxy](/docs/flyctl/proxy/)	 - Proxies connections to a fly VM
* [regions](/docs/flyctl/regions/)	 - Manage regions
* [releases](/docs/flyctl/releases/)	 - List app releases
* [restart](/docs/flyctl/restart/)	 - Restart an application
* [resume](/docs/flyctl/resume/)	 - Resume an application
* [scale](/docs/flyctl/scale/)	 - Scale app resources
* [secrets](/docs/flyctl/secrets/)	 - Manage app secrets
* [ssh](/docs/flyctl/ssh/)	 - Commands that manage SSH credentials
* [status](/docs/flyctl/status/)	 - Show app status
* [suspend](/docs/flyctl/suspend/)	 - Suspend an application
* [turboku](/docs/flyctl/turboku/)	 - Launches heroku apps
* [version](/docs/flyctl/version/)	 - Show version information for the flyctl command
* [vm](/docs/flyctl/vm/)	 - Commands that manage VM instances
* [volumes](/docs/flyctl/volumes/)	 - Volume management commands
* [wireguard](/docs/flyctl/wireguard/)	 - Commands that manage WireGuard peer connections

## Options

~~~
  -t, --access-token string   Fly API Access Token
  -h, --help                  help for flyctl
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also


