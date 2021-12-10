---
title: Working with Fly Applications
layout: docs
sitemap: false
nav: firecracker
---

Once you have deployed a Fly application, you can view information about it, give the system secrets to share with it, and associate it with a custom domain. 


## _Viewing Applications_

`flyctl` can reveal useful information about the application: 

* generally about the application configuration
* specifically about the application deployment 
* and historically with the applications logs

### General Information

The `info` subcommand will reveal the name of the current application, owner, a short status and the application's hostname. There's also details of how the application's ports are mapped under **Services**.

Finally, it shows the **IP Addresses** that the application is mapped to. You'll need this information for configuring your custom domains.

```cmd
flyctl info
```
```output
App
  Name     = hellofly
  Owner    = demo
  Version  = 2
  Status   = running
  Hostname = hellofly.fly.dev

Services
  TASK   PROTOCOL   PORTS
  app    tcp        80 => 8080 [HTTP]
                    443 => 8080 [TLS, HTTP]

IP Addresses
  TYPE   ADDRESS                                CREATED AT
  v4     77.83.140.189                          2020-01-17T16:51:23Z
  v6     2a09:8280:1:27a2:d07e:157d:dd9e:87d2   2020-01-17T16:51:24Z
```

The IP Address information is also available with the `flyctl ips list` command.

### Deployment Status

The `status` subcommand shows information on when the application was last deployed, what version is deployed and the status of that deployment. If
the deployment is currently running, it will also break that down. When the application is deployed, it has what are called allocations
in the various global datacenters. The `status` command will also detail those, including their status, region and when they were created.

```cmd
❯ flyctl status
```
```output
App
  Name     = hellofly
  Owner    = demo
  Version  = 3
  Status   = running
  Hostname = hellofly.fly.dev

Deployment Status
  ID          = cf39d39b-9951-0bda-ef3b-795014436095
  Version     = v3
  Status      = successful
  Description = Deployment completed successfully
  Allocations = 1 desired, 1 placed, 1 healthy, 0 unhealthy

Allocations
  ID         VERSION   REGION   DESIRED   STATUS    HEALTH CHECKS   CREATED
  61592bcb   3         ams      run       running   1 passing       39s ago
```

### Viewing Logs

Each Fly application has a log. It includes the console output of all instances of an application. Running `fly logs` you will display those logs and automatically wait for new log entries. For example, when we run the hellofly sample:

```cmd
flyctl logs
```
```output
2020-01-22T14:35:05.933Z 70fda853 ams [info] {"message":"\r","app":3366,"region":"ams","alloc":"70fda853"}
2020-01-22T14:35:05.935Z 70fda853 ams [info] - using env:	export GIN_MODE=release
2020-01-22T14:35:05.935Z 70fda853 ams [info] - using code:	gin.SetMode(gin.ReleaseMode)
2020-01-22T14:35:05.935Z 70fda853 ams [info] {"message":"\r","app":3366,"region":"ams","alloc":"70fda853"}
2020-01-22T14:35:05.936Z 70fda853 ams [info] -
2020-01-22T14:35:05.937Z 70fda853 ams [info] - hellofly.tmpl
2020-01-22T14:35:05.937Z 70fda853 ams [info] {"message":"\r","app":3366,"region":"ams","alloc":"70fda853"}
```

The log lines consist of an ISO format date and time, the allocation id - the identifier for a particular instance of the app that is running, the [region](/docs/regions/) where this instance of the app is running, the level of the attached message and then the actual log line. An entry such as 

`{"message":"\r","app":3366,"region":"ams","alloc":"70fda853"}` 

is recording an unhandled, and in this case incomplete, log line. It is also possible to filter by region or instance id. Consult the [flyctl documentation for logs](/docs/flyctl/logs/).


## _Working with Secrets_

Passing information, like credentials, to an application is handled through Fly's secrets. Create a secret value with a name and when the application runs, the secret will be available in the applications environment variables. Say we want to pass BANKPASSWORD to our sample application. In our node.js application, we can access that secret by using this code:

```bash
password=process.env.BANKPASSWORD
```

All we need to do now is set it, and that's done with `flyctl secrets set`. It takes a list of names and values as parameters.

```cmd
flyctl secrets set BANKPASSWORD="M0M0NEY"
```
```output
VERSION   TYPE      STATUS   DESCRIPTION       USER                 DATE
v1        release            Secrets updated   demo@fly.io          just now
```

New instances of the app will now see that value. The `secrets set` command can also set a number of secrets at the same time and take secrets from STDIN. See the [flyctl documentation for secrets set](/docs/flyctl/secrets-set/) for details.

If you need to know what secrets have been set then `flyctl secrets list` will show you:

```cmd
flyctl secrets list
```
```output
NAME           DIGEST                             DATE
BANKPASSWORD   51e7d4ab982ee30a690d12f15b866370   8m7s ago
```

It will only show you the name. The value is not shown as it is a secret.

If you need to remove a secret from an app, `flyctl secrets unset` will remove them by name

```cmd
flyctl secrets unset BANKPASSWORD
```
```output
VERSION   TYPE      STATUS   DESCRIPTION       USER                 DATE
v11       release            Secrets updated   demo@fly.io          just now
```

## _Fly and Custom Domains_

When you create a Fly app, it is automatically given a fly.dev sub-domain, based on the app's name. This is great for testing but when you want to go to full production you'll want your application to appear on your own domain and have HTTPS set up for you as it is with your .fly.dev domain. That's where the `flyctl certs` command comes in. But let's step back before we set up the TLS certificate, to the first step: **Directing Traffic To Your Site**.

### Setting A CNAME Record

The simplest option for directing traffic to your site is to create a CNAME record for your custom domain that points at your .fly.dev host. So if you have a custom domain called `mydreamdomain.com` and an app called exemplum.fly.dev, you can create a CNAME record for mydreamdomain.com's DNS that would look like:

```
CNAME @ exemplum.fly.dev
```

You'll need to configure this with your DNS provider. 

Now, accessing `mydreamdomain.com` will tell the DNS system to look up `exemplum.fly.dev` and return its results for you. 

### Setting The A Record

The other option is slightly more complicated in that it uses the IP address of the app, rather than its DNS name. The upside is that it is slightly faster. 

To start, we need the Fly IP address of our deployed application. To get that, use the `flyctl ips list` command we covered earlier on.

You'll need to configure this with your DNS provider.

 but simply add in an "A Record" for your domain that points to the IP address. Once this is done and propagated through the DNS system, you should be able to connect over unencrypted HTTP to using the domain name: `http://example.com`.

If we have our domain `mydreamdomain.com`,

### Getting Certified

To enable HTTPS on the domain, you need to get a certificate. Fly does that for you automatically! 
It starts with creating a certificate for *your* custom domain with `flyctl certs create example.com`:

```cmd
flyctl certs add mydreamdomain.com
```
```output
  Hostname                    = mydreamdomain.com
  Configured                  = true
  Issued                      =
  Certificate Authority       = lets_encrypt
  DNS Provider                = enom
  DNS Validation Instructions =
  DNS Validation Hostname     =
  DNS Validation Target       = mydreamdomain.com.5xzw.flydns.net
  Source                      = fly
  Created At                  = 0001-01-01T00:00:00Z
  Status                      =
```

This will start the process of getting a certificate. Run `flyctl certs show example.com` to get the details needed for your next step:

```cmd
flyctl certs show mydreamdomain.com
```
```output
  Hostname                    = mydreamdomain.com
  Configured                  = true
  Issued                      = ecdsa, rsa
  Certificate Authority       = lets_encrypt
  DNS Provider                = enom
  DNS Validation Instructions = CNAME _acme-challenge.mydreamdomain.com => mydreamdomain.com.5xzw.flydns.net.
  DNS Validation Hostname     = _acme-challenge.mydreamdomain.com
  DNS Validation Target       = mydreamdomain.com.5xzw.flydns.net
  Source                      = fly
  Created At                  = 1m24s ago
  Status                      = Ready
```

The **DNS Validation Instructions** are an *optional* next step. For a short time (minutes) after we start the process of generating
the first-ever certificate for your site, trying to load that site with an HTTPS URL will generate errors. If you'd like to make sure
those errors aren't ever visible, you can use a DNS challenge to pre-generate the certificate. 

To do that, you need to create a `CNAME` DNS record which for a subdomain `_acme-challenge` of your domain (the DNS Validation host name)
and point it at the DNS Validation Target. The process will depend on your DNS provider. Once complete, and the updated DNS data has propagated, that domain will be queried and confirm you have
control of it. Certificates will be generated and installed and you will then be able to access `https://example.com` (or whatever your custom domain is called).


