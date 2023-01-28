---
title: Examine an App
objective: 
layout: appsv2
order: 15
---

Once your Fly App is launched, `flyctl` has various tools for getting information about it. You can also find a lot of information on your Fly.io [web dashboard](https://fly.io/dashboard).

## Find all your Apps

You can see a list of all your Fly.io Apps:

```cmd
fly apps list
```
```out
NAME                                    OWNER           STATUS          PLATFORM        LATEST DEPLOY        
testrun                                 personal        deployed        machines                            
olddeadapp                              personal        dead            nomad           2022-12-27T23:33:07Z
```

## App Overviews

If you want a brief App overview, including a list of Machines on that App:

```cmd
fly status
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

`fly machine list` yields similar Machine information, but only for V2 Apps.

```cmd
fly machine list
```
```out
1 machines have been retrieved from app testrun.
View them in the UI here (​https://fly.io/apps/testrun/machines/)

testrun
ID              NAME            STATE   REGION  IMAGE                                         IP ADDRESS                       VOLUME  CREATED                 LAST UPDATED         
e286065f969386  rough-tree-1360 started iad     testrun:deployment-01GQR4GN7EA8G12VE1DBRQG4KQ   fdaa:0:3b99:a7b:8aeb:fea3:148b:2         2023-01-25T21:35:32Z    2023-01-26T22:52:36Z
```

## Examine a specific Machine

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

## Public IP addresses

Find your App's public Anycast IPs with `fly ips list`.

```cmd
fly ips list
```
```out
VERSION IP                      TYPE            REGION  CREATED AT           
v6      2a09:8280:1::d285       public          global  2023-01-25T21:35:29Z
v4      66.241.125.211          public (shared)           
```

Read more about [Public Network Services](/docs/reference/services/) and [Private Networking](/docs/reference/private-networking/).


## SSH into it

You can use `fly ssh console` to get a prompt on a Machine in your App (as long as the Machine's Docker image includes `sh`). You may want to connect to a specific Machine, and you can do that with `fly ssh console -s`:

```cmd
fly ssh console -s
```
```out
? Select Machine: iad: e286065f969386 fdaa:0:3b99:a7b:8aeb:fea3:148b:2 rough-tree-1360
Connecting to fdaa:0:3b99:a7b:8aeb:fea3:148b:2... complete
# 
```

## Inspect the Current Configuration of a Deployed App or Machine

Machines can be configured individually, but the App's config is applied on `fly deploy` to all Machines that are administered by the App. Display the App configuration in JSON format with `fly config show`, or a tack a specific Machine's current configuration onto the end of `fly machine status` by appending the `-d` flag.

```cmd
$ fly m status e784459b655483 -d
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