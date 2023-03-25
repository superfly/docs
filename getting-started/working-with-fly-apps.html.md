---
title: Working with Fly Apps
layout: docs
sitemap: false
nav: firecracker
---

Once you have deployed an application to Fly.io, you can view information about it, give the system secrets to share with it, associate it with a custom domain, and more. 

### Check Deployment Status

The `fly status` command shows information on when the application was last deployed, what version is deployed and the status of that deployment. If
the deployment is currently running, it will also break that down. Once the app is deployed, its VMs are listed, including their status, region and when they were created.

```cmd
fly status
```
```output
App
  Name     = testrun                                        
  Owner    = personal                                   
  Hostname = testrun.fly.dev                                
  Image    = testrun:deployment-01GTYFV11PM7D7B30AWZSH1FZE  
  Platform = machines                                   

Machines
ID              PROCESS VERSION REGION  STATE   HEALTH CHECKS   LAST UPDATED         
178115db494e18  app     2       lhr     started                 2023-03-07T16:53:06Z
```

[More ways to examine your app](/docs/apps/info/)

## Set Secrets

Passing information, like credentials, to an application is handled through Fly's secrets. Create a secret value with a name and when the application runs, the secret will be available in the applications environment variables. Say we want to pass BANKPASSWORD to our sample application. In our node.js application, we can access that secret by using this code:

```bash
password=process.env.BANKPASSWORD
```

All we need to do now is set it, and that's done with `fly secrets set`. It takes a list of names and values as parameters.

```cmd
fly secrets set BANKPASSWORD="M0M0NEY"
```
```output
VERSION   TYPE      STATUS   DESCRIPTION       USER                 DATE
v1        release            Secrets updated   demo@fly.io          just now
```

New instances of the app will now see that value. The `secrets set` command can also set a number of secrets at the same time and take secrets from STDIN. See the [flyctl documentation for `secrets set`](/docs/flyctl/secrets-set/) for details.

If you need to know what secrets have been set then `fly secrets list` will show you:

```cmd
fly secrets list
```
```output
NAME           DIGEST                             DATE
BANKPASSWORD   51e7d4ab982ee30a690d12f15b866370   8m7s ago
```

It will only show you the name. The value is not shown as it is a secret.

If you need to remove a secret from an app, `fly secrets unset` will remove them by name

```cmd
fly secrets unset BANKPASSWORD
```
```output
VERSION   TYPE      STATUS   DESCRIPTION       USER                 DATE
v11       release            Secrets updated   demo@fly.io          just now
```

## Fly.io and Custom Domains

When you create a Fly App, it is automatically given a fly.dev sub-domain, based on the app's name. This is great for testing but when you want to go to full production you'll want your application to appear on your own domain and have HTTPS set up for you as it is with your .fly.dev domain. That's where the `fly certs` command comes in. But let's step back before we set up the TLS certificate, to the first step: **Directing Traffic To Your Site**.

### Set A CNAME Record

The simplest option for directing traffic to your site is to create a CNAME record for your custom domain that points at your .fly.dev host. So if you have a custom domain called `mydreamdomain.com` and an app called exemplum.fly.dev, you can create a CNAME record for mydreamdomain.com's DNS that would look like:

```
CNAME @ exemplum.fly.dev
```

You'll need to configure this with your DNS provider. 

Now, accessing `mydreamdomain.com` will tell the DNS system to look up `exemplum.fly.dev` and return its results for you. 

### Set The A Record

The other option is slightly more complicated in that it uses the IP address of the app, rather than its DNS name. The upside is that it is slightly faster. 

To start, we need the Fly IP address of our deployed application. To get that, use the `fly ips list` command we covered earlier on.

You'll need to configure this with your DNS provider.

 but simply add in an "A Record" for your domain that points to the IP address. Once this is done and propagated through the DNS system, you should be able to connect over unencrypted HTTP to using the domain name: `http://example.com`.

If we have our domain `mydreamdomain.com`,

### Get Certified

To enable HTTPS on the domain, you need to get a certificate. Fly does that for you automatically! 
It starts with creating a certificate for *your* custom domain with `fly certs create example.com`:

```cmd
fly certs add mydreamdomain.com
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

This will start the process of getting a certificate. Run `fly certs show example.com` to get the details needed for your next step:

```cmd
fly certs show mydreamdomain.com
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


