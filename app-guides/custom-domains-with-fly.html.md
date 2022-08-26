---
title: "SSL for Custom Domains"
layout: docs
sitemap: false
nav: firecracker
author: dj
categories:
  - ssl
  - custom domains
  - guide
date: 2020-07-20
---

An application's brand is often encapsulated in its domain name and that in turn is wrapped with value. So being able to configure secure custom domains is essential.

Fly offers a simple command-line process for manual configuration of custom domains and a GraphQL API for people integrating Fly custom domains into their automated workflows. Here, we'll be looking at both - and answering the question, which one should you use?

## Teaching your app about custom domains

Your application code needs to know how to accept custom domains and adjust the responses accordingly. If you're hosting content on behalf of your users, this typically means mapping the incoming hostname to a particular ID in your application database.

When users make requests, their browser sends a `Host` header you can use to alter the behavior of your application. When you run your app server on Fly directly, just get the contents of the `Host` header to identify a request.

If you're running your application on another provider, you will need to create a proxy application (like [NGINX](/docs/app-guides/global-nginx-proxy/)) to route traffic through Fly. Your application can then use the `X-Forwarded-Host` header to determine how to handle requests.

## Creating a custom domain on Fly manually

There's a question to ask and answer. Do you want to start accepting traffic immediately on your custom domain or do you want to have your domain ready with certificates when you set it to start accepting traffic, for example when you want to cut over from another platform to Fly.

### Accepting traffic immediately for the custom domain

In this scenario, we want the custom domain to point to the `nginxproxy` server which will allow unencrypted IPv4 and IPv6 connections. Again, there are two ways to do this. Using DNS's CNAME capability or setting the A and AAAA records.

#### Option I: CNAME records

CNAME records in DNS act like a pointer. If we add a CNAME record to our custom domain that points to our proxy name `nginxproxy.fly.dev` then requests for the custom domain's IP address would return the proxy's address and clients would then lookup the IP addresses for the proxy. 

It's the quickest way to get set up, but there are catches. First, it is ever so slightly slower with that second look up. Second, it limits what you can do with the domain, especially if it's an "Apex domain" - CNAMEs are, according to DNS standards, meant to be the only record in a host's DNS records and so you can't add MX and other essential records to the DNS entry. If you aren't setting up an Apex domain, the CNAME is the quickest way to get going.

#### Option II: A and AAAA records

We can skip all CNAME concerns by setting A and AAAA records on your custom domain. Run `flyctl ips list` to see your app's addresses:

```cmd
flyctl ips list
```
```output
  TYPE   ADDRESS                                CREATED AT
  v4     77.83.143.105                          2020-03-02T14:59:13Z
  v6     2a09:8280:1:659f:6cb7:4925:6bfd:90a3   2020-03-02T14:59:13Z
```

Create an A record pointing to your v4 address, and an AAAA record pointing to your v6 address. You're then free to make this an Apex domain as needed.

#### Adding the certificate

Once these settings are in place, you can add the custom domain to the application's certificates. If we are configuring example.com, then we would simply run:

```cmd
flyctl certs create example.com
```

If you are adding a wildcard domain, remember to place quotes around the hostname to avoid inadvertent shell expansion:

```cmd
flyctl certs create "*.example.com"
```

This will kick off the process of validating your domain and generating certificates. You can check on the progress if you run:

```cmd
flyctl certs show example.com
```
```output
  Hostname                    = example.com
  Configured                  = true
  Issued                      = rsa,ecdsa
  Certificate Authority       = lets_encrypt
  DNS Provider                = dnsimple
  DNS Validation Instructions = CNAME _acme-challenge.example.com => example.com.o055.flydns.net.
  DNS Validation Hostname     = _acme-challenge.example.com
  DNS Validation Target       = example.com.o055.flydns.net
  Source                      = fly
  Created At                  = 1m9s ago
  Status                      = Ready
```

Configured should be true and Status will show ready when the certificates are available. The Issued field will show which types of certificates are available - RSA and/or ECDSA. Once they are issued, you'll be ready to run with your custom domain.

### Configuring certificates before accepting traffic

This process allows certificates to be issued before the domain is live and accepting traffic. Using a particular CNAME entry in the DNS allows Fly to validate the domain before issuing a certificate. 

The process starts with adding the certificate to the application like so:

```cmd
flyctl certs create example.com
```

Again, if you are creating a wildcard domain, remember to place quotes around the hostname to avoid inadvertent shell expansion:

```cmd
flyctl certs create "*.example.com"
```

Now we have created the certificate, we need to ask for the CNAME entry that has to be set up. For this, we run `fly certs show`:

```cmd
flyctl certs show example.com
```
```output
  Hostname                    = example.com
  Configured                  = false
  Issued                      = 
  Certificate Authority       =
  DNS Provider                = dnsimple
  DNS Validation Instructions = CNAME _acme-challenge.example.com => example.com.o055.flydns.net.
  DNS Validation Hostname     = _acme-challenge.example.com
  DNS Validation Target       = example.com.o055.flydns.net
  Source                      = fly
  Created At                  = 0m9s ago
  Status                      = 
```

The specific part to focus in here are the DNS Validation fields:

```
DNS Validation Instructions = CNAME _acme-challenge.example.com => example.com.o055.flydns.net.
  DNS Validation Hostname     = _acme-challenge.example.com
  DNS Validation Target       = example.com.o055.flydns.net
```

Basically, the Validation Hostname, when looked up, should send requests to the Validation Target, a Fly-generated validation service. To do this, add the contents of the Validation Instructions to your DNS records; that is create a CNAME record which points the _acme-challenge subdomain to the Validation target.

Once you have done that, wait as the validation and certificate issuing happens (check in with `flyctl certs check`). When complete, you'll be able to turn on the traffic whenever you are ready. You'll be able to do that either by setting the CNAME or by setting the A and AAAA records as described previously.

### Other commands

Finally, we should point out the other `flyctl certs` commands which you will want to use.

* `flyctl certs list` - Lists the hostnames which have been added to an application and for which certificates may have been obtained.
* `flyctl certs check hostname` - Triggers a check on the domain validation and DNS configuration for the given host and return results in the same format as `flyctl certs show`.
* `flyctl certs delete hostname` - Removes the hostname from the application, dropping the certificates in the process.

## Automating the certificate process

To illustrate how to automate the certificates API, we are going to show the `flyctl` command line and the equivalent GraphQL request, wrapped in a compact easy-to-read Node application from our [fly-examples/hostnamesapi](https://github.com/fly-apps/hostnamesapi) repository.

### GraphQL API Notes

**Endpoints**: The Endpoint for the Fly API is `https://api.fly.io/graphql`. 

**Authentication**: All queries require an API token which be obtained by signing into the [Fly.io web dashboard](https://fly.io/dashboard/apps/), selecting **Account** ➡︎ **Settings** ➡︎ **Access Tokens** ➡︎ **Create Access Token**. Create a new token and carefully note the value; we suggest placing it in an environment variable such as `FLY_API_TOKEN` so it can be passed to applications. When used with the API, the token should be passed in an `Authorization` header with the value `Bearer <token value>`.

**IDs and Names**: Applications can be referred to by name or by ID. Currently the Application ID and Name are interchangeable. This will change in a future semantically significant version. To see how to query for ID and Name, see [getappbyid.js](https://github.com/fly-apps/hostnamesapi/blob/master/getappbyid.js) and [getappbyname.js](https://github.com/fly-apps/hostnamesapi/blob/master/getappbyname.js) in the example repository.

### Listing all the hosts of an application

**With Flyctl**: `flyctl certs list`

**With GraphQL**: The example is in the repository as [getcerts.js](https://github.com/fly-apps/hostnamesapi/blob/master/getcerts.js). This request takes the application name as a parameter.

```graphql
query($appName: String!) {
  app(name: $appName) {
    certificates {
      nodes {
        createdAt
        hostname
        clientStatus
      }
    }
  }
}
```

**Example output**:

```json
{
  "app": {
    "certificates": {
      "nodes": [
        {
          "createdAt": "2020-03-04T14:17:14Z",
          "hostname": "example.com",
          "clientStatus": "Ready"
        },
        {
          "createdAt": "2020-03-05T15:28:41Z",
          "hostname": "exemplum.com",
          "clientStatus": "Ready"
        }
		  ]
	  }
  }
}
```

This lists every host associated with the application. Each host may have up to two (RSA/ECDSA) certificates associated with it. See "[Reading a certificate from an application](#reading-a-certificate-from-an-application)" to see how to query the certificates associated with the hostnames.

### Creating a certificate for an application

**With Flyctl**: `flyctl certs create <hostname>`

**With GraphQL**: The example is [addcert.js](https://github.com/fly-apps/hostnamesapi/blob/master/getcerts.js). This request takes the application id and hostname as parameters.

```graphql
mutation($appId: ID!, $hostname: String!) {
    addCertificate(appId: $appId, hostname: $hostname) {
        certificate {
            configured
            acmeDnsConfigured
            acmeAlpnConfigured
            certificateAuthority
            certificateRequestedAt
            dnsProvider
            dnsValidationInstructions
            dnsValidationHostname
            dnsValidationTarget
            hostname
            id
            source
        }
    }
}
```


**Example Output**:

```json
{
  "addCertificate": {
    "certificate": {
      "configured": true,
      "acmeDnsConfigured": true,
      "acmeAlpnConfigured": true,
      "certificateAuthority": "lets_encrypt",
      "certificateRequestedAt": "2020-03-06T12:26:36Z",
      "dnsProvider": "enom",
      "dnsValidationInstructions": "CNAME _acme-challenge.codepope.wtf => example.com.o055.flydns.net.",
      "dnsValidationHostname": "_acme-challenge.example.com",
      "dnsValidationTarget": "example.com.o055.flydns.net",
      "hostname": "example.com",
      "id": "LO7FgYIy0sBZC8yuGNFKQH4QCq4ujMfJZumJCVNiQxhMq",
      "source": "fly"
    }
  }
}
```

The returned data here includes all the values needed to configure DNS records for pre-traffic validation.

### Reading a certificate from an application

**With Flyctl**: `flyctl certs show hostname`

**With GraphQL**: The example is [getcert.js](https://github.com/fly-apps/hostnamesapi/blob/master/getcert.js). This request takes the application name and hostname as parameters.

```graphql
query($appName: String!, $hostname: String!) {
  app(name: $appName) {
    certificate(hostname: $hostname) {
      configured
      acmeDnsConfigured
      acmeAlpnConfigured
      certificateAuthority
      createdAt
      dnsProvider
      dnsValidationInstructions
      dnsValidationHostname
      dnsValidationTarget
      hostname
      id
      source
      clientStatus
      issued {
        nodes {
          type
          expiresAt
        }
      }
    }
  }
}
```

**Example Output**:

```json
{
  "app": {
    "certificate": {
      "configured": true,
      "acmeDnsConfigured": true,
      "acmeAlpnConfigured": true,
      "certificateAuthority": "lets_encrypt",
      "createdAt": "2020-03-04T17:17:39Z",
      "dnsProvider": "enom",
      "dnsValidationInstructions": "CNAME _acme-challenge.example.com => example.com.o055.flydns.net.",
      "dnsValidationHostname": "_acme-challenge.example.com",
      "dnsValidationTarget": "example.com.o055.flydns.net",
      "hostname": "example.com",
      "id": "4n8ikGIzjsm0s5VclwTDaSODtveu2xCZkHkKCaRilafGk",
      "source": "fly",
      "clientStatus": "Ready",
      "issued": {
        "nodes": [
          {
            "type": "ecdsa",
            "expiresAt": "2020-06-02T16:17:51Z"
          },
          {
            "type": "rsa",
            "expiresAt": "2020-06-02T16:17:45Z"
          }
        ]
      }
    }
  }
}
```

Most of the output duplicates the details from adding a certificate, including the DNS validation settings. The difference here is the `issued` section which contains an array of nodes, each of which is the type and expiry date of certificates that have been issued against this host name. Here we see that ECSDA and RSA certificates have been issued.

### Checking a certificate

**With Flyctl**: `flyctl certs check hostname`

**With GraphQL**: The example is [checkcert.js](https://github.com/fly-apps/hostnamesapi/blob/master/checkcert.js). This request takes the application name and hostname as parameters. It is essentially the same as reading the certificate, but the presence of a request for the certificate's check value will start a validation process. The output is similar too.

```graphql
query($appName: String!, $hostname: String!) {
  app(name: $appName) {
    certificate(hostname: $hostname) {
        check
        configured
        acmeDnsConfigured
        acmeAlpnConfigured
        certificateAuthority
        createdAt
        dnsProvider
        dnsValidationInstructions
        dnsValidationHostname
        dnsValidationTarget
        hostname
        id
        source
        clientStatus
        issued {
          nodes {
              type
              expiresAt
          }
        }
    }
  }
}
```


### Deleting a certificate


**With Flyctl**: `flyctl certs delete hostname`

**With GraphQL**: The example is [deletecert.js](https://github.com/fly-apps/hostnamesapi/blob/master/deletecert.js). This request takes the application name and hostname as parameters and will remove the hostname from the application.

```graphql
   mutation($appId: ID!, $hostname: String!) {
        deleteCertificate(appId: $appId, hostname: $hostname) {
            app {
                name
            }
            certificate {
                hostname
                id
            }
        }
    }
```

The GraphQL mutation returns the app name and the hostname and certificate id that was removed.

**Example Output**:

```json
{
  "deleteCertificate": {
    "app": {
      "name": "nginxproxy"
    },
    "certificate": {
      "hostname": "example.com",
      "id": "6AZc4AS6ysZgHPqFg7TGzIyofewuZnToxu6lUbBi8DHGQ"
    }
  }
}
```

## Troubleshooting

**I use Cloudflare, and my fly.io SSL certificate doesn't seem to issue**

If you're using Cloudflare, you might be using their Universal SSL feature which inserts a TXT record for `_acme_challenge.mydomain` that interferes with our cert validation. You should disable this feature, and verify by running `dig txt _acme-challenge.mydomain.com +short` to see if it returns with a fly address.

## Wrapping up

You have everything you need to either hand assign a custom domain to your Fly application or to create your own automated multi-domain proxy. Let your ideas take flight with Fly.

