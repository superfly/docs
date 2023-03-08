---
title: Get Information about an App
objective: 
layout: docs
nav: firecracker
order: 15
---

Once your Fly App is launched, `flyctl` has various tools for getting information about it. You can also find a lot of information on your Fly.io [web dashboard](https://fly.io/dashboard).

## Find all your Apps

You can see a list of all your Fly Apps:

```cmd
fly apps list
```
```out
NAME          OWNER           STATUS          PLATFORM        LATEST DEPLOY        
testrun       personal        deployed        machines                            
olddeadapp    personal        dead            nomad           2022-12-27T23:33:07Z
```

## App Overviews

If you want a brief app overview, including a list of Machines on that app with their current status, use `fly status`:

```cmd
fly status -a testrun
```
```out
App
  Name     = testrun          
  Owner    = personal         
  Hostname = testrun.fly.dev  
  Platform = machines         

ID              STATE   REGION  HEALTH CHECKS           IMAGE                                           CREATED                 UPDATED              
06e82d43ad1587  started yyz     1 total, 1 passing      testrun:deployment-01GQ0HKV6TDT7DX0G50MT50FZD   2023-01-17T17:54:04Z    2023-01-17T21:42:33Z
```

As with many flyctl commands, if you leave off the `-a` flag, `fly status` will infer the app name from the `fly.toml` file in the working directory, if there is one.

`fly machine list` yields a different set of information for each Machine on a [V2 App](/docs/reference/apps/), including the Machine's [internal IPv6 address](/docs/reference/private-networking/):

```cmd
fly machine list -a testrun
```
```out
1 machines have been retrieved from app testrun.
View them in the UI here (​https://fly.io/apps/testrun/machines/)

testrun
ID              NAME                    STATE   REGION  IMAGE                                           IP ADDRESS                           VOLUME  CREATED                 LAST UPDATED            APP PLATFORM    PROCESS GROUP 
178115db494e18  holy-waterfall-9884     started lhr     testrun:deployment-01GTYFV11PM7D7B30AWZSH1FZE       fdaa:0:3b99:a7b:a98:6c48:67c5:2              2023-03-07T16:52:59Z    2023-03-07T16:53:06Z    v2              app    
```

## Examine a specific Machine (V2 only)

You can drill down and get an overview of a particular Machine with `fly machine status`.  This is where you'll find the Machine's CPU size and RAM settings.

```cmd
fly machine status e286065f969386
```
```out
Machine ID: e286065f969386
Instance ID: 01GQR4GR5TPQC65T5RMKR0HS87
State: started

Machine
  ID            = e286065f969386                               
  Instance ID   = 01GQR4GR5TPQC65T5RMKR0HS87                   
  State         = started                                      
  Image         = testrun:deployment-01GQR4GN7EA8G12VE1DBRQG4KQ  
  Name          = rough-tree-1360                              
  Private IP    = fdaa:0:3b99:a7b:8aeb:fea3:148b:2             
  Region        = iad                                          
  Process Group =                                              
  Memory        = 256                                          
  CPUs          = 1                                            
  Created       = 2023-01-25T21:35:32Z                         
  Updated       = 2023-01-26T22:52:36Z                         
  Command       =                                              

Event Logs
STATE   EVENT   SOURCE  TIMESTAMP                       INFO 
started start   flyd    2023-01-26T17:52:36.678-05:00
created launch  user    2023-01-26T17:52:33.348-05:00
```

## Services

See the configured services with `fly services list`.

```cmd
fly services list
```
```out
Services
PROTOCOL        PORTS                   FORCE HTTPS 
TCP             80 => 8080 [HTTP]       True       
                443 => 8080 [TLS,HTTP]  False 
```

## Public IP addresses

Find your app's public Anycast IPs with `fly ips list`.

```cmd
fly ips list
```
```out
VERSION IP                      TYPE            REGION  CREATED AT           
v6      2a09:8280:1::d285       public          global  2023-01-25T21:35:29Z
v4      66.241.125.211          public (shared)           
```

Read more about [Public Network Services](/docs/reference/services/) and [Private Networking](/docs/reference/private-networking/).


## Check on it from inside

You can use `fly ssh console` to get a prompt on a Machine in your app (as long as the Machine's Docker image includes `sh`). You may want to connect to a specific Machine, and you can do that with `fly ssh console -s`:

```cmd
fly ssh console -s
```
```out
? Select Machine: iad: e286065f969386 fdaa:0:3b99:a7b:8aeb:fea3:148b:2 rough-tree-1360
Connecting to fdaa:0:3b99:a7b:8aeb:fea3:148b:2... complete
# 
```

If you have a particular command in mind, it might be quicker to use the `-C` flag to just run the command; for example to check on free space in the Machine file system, you might run

```cmd
fly ssh console -C df
```
```out
Connecting to fdaa:0:3b99:a7b:7e:3155:9844:2... complete
Filesystem     1K-blocks   Used Available Use% Mounted on
devtmpfs          103068      0    103068   0% /dev
/dev/vda         8191416 172748   7582856   3% /
shm               113224      0    113224   0% /dev/shm
tmpfs             113224      0    113224   0% /sys/fs/cgroup
/dev/vdb         1011672   2564    940500   1% /storage
```



## Inspect the Current Configuration of a Deployed App or Machine

Machines can be configured individually, but the app's config is applied on `fly deploy` to all Machines that are administered by the app. Display the app configuration in JSON format with `fly config show`, 


### Show the app config

```cmd
fly config show -a testrun
```

### Show a Machine's configuration

Tack a specific Machine's current configuration onto the output of `fly machine status` by appending the `-d` flag. Machines belonging to a Fly App will _usually_ be managed by `fly deploy` and so have the same configuration as their app.

```cmd
fly m status e784459b655483 -d
```
```out
Machine ID: e784459b655483
Instance ID: 01GQTQV0EMGV8XY4NYJN68247W
State: started

VM
  ID            = e784459b655483                               
  Instance ID   = 01GQTQV0EMGV8XY4NYJN68247W                   
  State         = started                                      
  Image         = testrun:deployment-01GQTQTJB5RCS03FKGX9K2H60B  
  Name          = red-feather-7761                             
  Private IP    = fdaa:0:3b99:a7b:92:9336:667f:2               
  Region        = iad                                          
  Process Group =                                              
  Memory        = 256                                          
  CPUs          = 1                                            
  Created       = 2023-01-27T23:08:41Z                         
  Updated       = 2023-01-27T23:09:10Z                         
  Command       =                                              

Event Logs
STATE   EVENT   SOURCE  TIMESTAMP                       INFO 
started start   flyd    2023-01-27T18:09:10.855-05:00
created launch  user    2023-01-27T18:08:41.361-05:00


Config:
{
  "init": {},
  "image": "registry.fly.io/testrun:deployment-01GQTQTJB5RCS03FKGX9K2H60B",
  "metadata": {
    "fly_platform_version": "v2",
    "fly_release_id": "QgDeJ3o11V2D7fkXVQGvPBON",
    "fly_release_version": "1"
  },
  "restart": {},
  "services": [
    {
      "protocol": "tcp",
      "internal_port": 4999,
      "ports": [
        {
          "port": 80,
          "handlers": [
            "http"
          ],
          "force_https": true
        },
        {
          "port": 443,
          "handlers": [
            "tls",
            "http"
          ]
        }
      ],
      "checks": [
        {
          "type": "tcp",
          "interval": "15s",
          "timeout": "2s"
        }
      ],
      "concurrency": {
        "type": "connections",
        "hard_limit": 25,
        "soft_limit": 20
      }
    }
  ],
  "guest": {
    "cpu_kind": "shared",
    "cpus": 1,
    "memory_mb": 256
  }
}
```

## Watch an app's logs

Running `fly logs` displays an app's logs as they happen. Logs include the console output of all instances of an application. Here are logs for an app that hangs around doing nothing but has a volume mounted so you can ssh in and create files.

```cmd
fly logs -a testrun
```
```out
2023-03-07T16:17:48Z runner[5683606c41098e] lhr [info]Pulling container image
2023-03-07T16:17:51Z runner[5683606c41098e] lhr [info]Unpacking image
2023-03-07T16:18:00Z runner[5683606c41098e] lhr [info]Setting up volume 'data'
2023-03-07T16:18:00Z runner[5683606c41098e] lhr [info]Uninitialized volume 'data', initializing...
2023-03-07T16:18:00Z runner[5683606c41098e] lhr [info]Encrypting volume
2023-03-07T16:18:05Z runner[5683606c41098e] lhr [info]Opening encrypted volume
2023-03-07T16:18:07Z runner[5683606c41098e] lhr [info]Formatting volume
2023-03-07T16:18:08Z runner[5683606c41098e] lhr [info]Configuring firecracker
2023-03-07T16:18:08Z app[5683606c41098e] lhr [info]Starting init (commit: 08b4c2b)...
2023-03-07T16:18:08Z app[5683606c41098e] lhr [info]Mounting /dev/vdb at /storage w/ uid: 0, gid: 0 and chmod 0755
2023-03-07T16:18:08Z app[5683606c41098e] lhr [info]Preparing to run: `sleep infinity` as root
2023-03-07T16:18:08Z app[5683606c41098e] lhr [info]2023/03/07 16:18:08 listening on [fdaa:0:3b99:a7b:7e:3155:9844:2]:22 (DNS: [fdaa::3]:53)
```

`fly logs` stays open, watching the logs, until you stop it (<kbd>ctrl-C</kbd>).

You can also [ship logs to an external service](/blog/shipping-logs/).
