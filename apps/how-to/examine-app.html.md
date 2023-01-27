---
title: Examine an App
objective: 
layout: framework_docs
order: 15
---

Once an app is launched, we have various tools for getting information about it.

If you want to see which Machines are running:

```
19:44:20 *[main][~/FlyTests/jan25/hello-gunicorn-flask]$ fly status
App
  Name     = jan25          
  Owner    = personal       
  Hostname = jan25.fly.dev  
  Platform = machines       

ID              STATE   REGION  HEALTH CHECKS   IMAGE                                           CREATED                   UPDATED              
e286065f969386  started iad                     jan25:deployment-01GQR4GN7EA8G12VE1DBRQG4KQ     2023-01-25T21:35:32Z      2023-01-26T22:52:36Z
```

`fly m list` is similar

```
fly m list
1 machines have been retrieved from app jan25.
View them in the UI here (​https://fly.io/apps/jan25/machines/)

jan25
ID              NAME            STATE   REGION  IMAGE                                         IP ADDRESS                       VOLUME  CREATED                 LAST UPDATED         
e286065f969386  rough-tree-1360 started iad     jan25:deployment-01GQR4GN7EA8G12VE1DBRQG4KQ   fdaa:0:3b99:a7b:8aeb:fea3:148b:2         2023-01-25T21:35:32Z    2023-01-26T22:52:36Z
```



If there's a `started` VM, you can try 


```
fly ips list
VERSION IP                      TYPE            REGION  CREATED AT           
v6      2a09:8280:1::d285       public          global  2023-01-25T21:35:29Z
v4      66.241.125.211          public (shared)           
```

You can drill down and get the status of a particular VM: 

```
fly m status e286065f969386
Machine ID: e286065f969386
Instance ID: 01GQR4GR5TPQC65T5RMKR0HS87
State: started

VM
  ID            = e286065f969386                               
  Instance ID   = 01GQR4GR5TPQC65T5RMKR0HS87                   
  State         = started                                      
  Image         = jan25:deployment-01GQR4GN7EA8G12VE1DBRQG4KQ  
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


## SSH into it

If it's running, and has a shell installed:

```
20:26:22 *[main][~/FlyTests/jan25/hello-gunicorn-flask]$ fly ssh console -s
? Select VM: iad: e286065f969386 fdaa:0:3b99:a7b:8aeb:fea3:148b:2 rough-tree-1360
Connecting to fdaa:0:3b99:a7b:8aeb:fea3:148b:2... complete
# 
```

