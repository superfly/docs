# _flyctl_

The Fly CLI

### About

flyctl is a command line interface to the Fly.io platform.

It allows users to manage authentication, application initialization, 
deployment, network configuration, logging and more with just the 
one command.

Initialize an App with the init command
Deploy an App with the deploy command
View a Deployed web application with the open command
Check the status of an application with the status command

To read more, use the docs command to view Fly's help on the web.

### Usage
```
flyctl [command] [flags]
```

### Available Commands
* [apps](/docs/flyctl/apps/)	 - Manage Apps
* [auth](/docs/flyctl/auth/)	 - Manage authentication
* [autoscale](/docs/flyctl/autoscale/)	 - Autoscaling App resources
* [builds](/docs/flyctl/builds/)	 - Work with Fly Builds
* [certs](/docs/flyctl/certs/)	 - Manage certificates
* [checks](/docs/flyctl/checks/)	 - Manage health checks
* [config](/docs/flyctl/config/)	 - Manage an Apps configuration
* [dashboard](/docs/flyctl/dashboard/)	 - Open web browser on Fly Web UI for this app
* [deploy](/docs/flyctl/deploy/)	 - Deploy an App to the Fly platform
* [destroy](/docs/flyctl/destroy/)	 - Permanently destroys an App
* [dns-records](/docs/flyctl/dns-records/)	 - Manage DNS records
* [docs](/docs/flyctl/docs/)	 - View Fly documentation
* [domains](/docs/flyctl/domains/)	 - Manage domains
* [history](/docs/flyctl/history/)	 - List an App's change history
* [info](/docs/flyctl/info/)	 - Show detailed App information
* [init](/docs/flyctl/init/)	 - Initialize a new application
* [ips](/docs/flyctl/ips/)	 - Manage IP addresses for Apps
* [launch](/docs/flyctl/launch/)	 - Launch a new app
* [list](/docs/flyctl/list/)	 - Lists your Fly resources
* [logs](/docs/flyctl/logs/)	 - View App logs
* [monitor](/docs/flyctl/monitor/)	 - Monitor Deployments
* [move](/docs/flyctl/move/)	 - Move an App to another organization
* [open](/docs/flyctl/open/)	 - Open browser to current deployed application
* [orgs](/docs/flyctl/orgs/)	 - Commands for managing Fly organizations
* [platform](/docs/flyctl/platform/)	 - Fly platform information
* [postgres](/docs/flyctl/postgres/)	 - Manage postgres clusters
* [regions](/docs/flyctl/regions/)	 - Manage regions
* [releases](/docs/flyctl/releases/)	 - List App releases
* [restart](/docs/flyctl/restart/)	 - Restart an application
* [resume](/docs/flyctl/resume/)	 - Resume an application
* [scale](/docs/flyctl/scale/)	 - Scale App resources
* [secrets](/docs/flyctl/secrets/)	 - Manage App secrets
* [ssh](/docs/flyctl/ssh/)	 - Commands that manage SSH credentials
* [status](/docs/flyctl/status/)	 - Show App status
* [suspend](/docs/flyctl/suspend/)	 - Suspend an application
* [version](/docs/flyctl/version/)	 - Show version information for the flyctl command
* [vm](/docs/flyctl/vm/)	 - Commands that manage VM instances
* [volumes](/docs/flyctl/volumes/)	 - Volume management commands
* [wireguard](/docs/flyctl/wireguard/)	 - Commands that manage WireGuard peer connections

### Options

```
  -t, --access-token string   Fly API Access Token
  -h, --help                  help for flyctl
  -j, --json                  json output
  -v, --verbose               verbose output
```

### See Also


