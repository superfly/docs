---
title: Custom Domains and SSL Certificates
layout: docs
nav: firecracker
categories:
  - ssl
  - custom domains
  - guide
redirect_from:
  - /docs/app-guides/custom-domains-with-fly/
---

For a quick custom domain how-to, see [Use a custom domain](/docs/networking/custom-domain/). 

An application's brand is often encapsulated in its domain name, and that in turn is wrapped with value. So being able to configure secure custom domains is essential.

Fly.io offers a simple command-line process for manual configuration of custom domains and a GraphQL API for people integrating Fly.io custom domains into their automated workflows. Here, we'll be looking at both - and answering the question, which one should you use?

## Teaching your app about custom domains

Your application code needs to know how to accept custom domains and adjust the responses accordingly. If you're hosting content on behalf of your users, this typically means mapping the incoming hostname to a particular ID in your application database.

When users make requests, their browser sends a `Host` header you can use to alter the behavior of your application. When you run your app server on Fly.io directly, just get the contents of the `Host` header to identify a request.

If you're running your application on another provider, you will need to create a proxy application, like NGINX to route traffic through Fly.io. Your application can then use the `X-Forwarded-Host` header to determine how to handle requests.

## Creating a custom domain on Fly.io manually

There's a question to ask and answer. Do you want to start accepting traffic immediately on your custom domain or do you want to have your domain ready with certificates when you set it to start accepting traffic, for example when you want to cut over from another platform to Fly.io.

### Accepting traffic immediately for the custom domain

In this scenario, we want the custom domain to point to the `nginxproxy` server which will allow unencrypted IPv4 and IPv6 connections. Again, there are two ways to do this. Using DNS CNAME capability or setting the A and AAAA records.

#### Option I: CNAME records

CNAME records in DNS act like a pointer. If we add a CNAME record to our custom domain that points to our proxy name `nginxproxy.fly.dev` then requests for the custom domain's IP address would return the proxy's address and clients would then lookup the IP addresses for the proxy.

It's the quickest way to get set up, but there are catches. First, it is ever so slightly slower with that second look up. Second, it limits what you can do with the domain, especially if it's an "Apex domain" - CNAME records are, according to DNS standards, meant to be the only record in a host's DNS records and so you can't add MX and other essential records to the DNS entry. If you aren't setting up an Apex domain, the CNAME is the quickest way to get going.

#### Option II: A and AAAA records

We can skip all CNAME concerns by setting A and AAAA records on your custom domain. Run `fly ips list` to see your app's addresses:

```cmd
fly ips list
```
```output
  TYPE   ADDRESS                                CREATED AT
  v4     77.83.143.105                          2020-03-02T14:59:13Z
  v6     2a09:8280:1:659f:6cb7:4925:6bfd:90a3   2020-03-02T14:59:13Z
```

Create an A record pointing to your IPv4 address, and an AAAA record pointing to your IPv6 address. You're then free to make this an Apex domain as needed.

<div class="important">
**Important:** Our hostname validation will fail without an IPv6 address and we won't attempt to issue or renew a certificate. If your app does not have one, you can allocate one with `flyctl ips allocate-v6`. If you use a CNAME `_acme-challenge` for domain verification, you don't need to worry about this. However, it is still recommended to have both IPv4 and IPv6 addresses allocated if your app is serving traffic.
</div>

#### Adding the certificate

Once these settings are in place, you can add the custom domain to the application's certificates. If we are configuring example.com, then we would simply run:

```cmd
fly certs add example.com
```

If you need a wildcard domain, remember to place quotes around the hostname to avoid shell expansion:

```cmd
fly certs add "*.example.com"
```

This will kick off the process of validating your domain and generating certificates. You can check on the progress if you run:

```cmd
fly certs show example.com
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

`Configured` should be true and `Status` will show `Ready` when the certificates are available. The `Issued` field shows which types of certificates are available: RSA and/or ECDSA. Once they are issued, you'll be ready to run with your custom domain.

### Configuring certificates before accepting traffic

This process allows certificates to be issued before the domain is live and accepting traffic. Using a particular CNAME entry in the DNS allows Fly.io to validate the domain before issuing a certificate.

The process starts with adding the certificate to the application like so:

```cmd
fly certs add example.com
```

Again, if you are creating a wildcard domain, remember to place quotes around the hostname to avoid shell expansion:

```cmd
fly certs add "*.example.com"
```

Now we have created the certificate, we need to ask for the CNAME entry that has to be set up. For this, we run `fly certs show`:

```cmd
fly certs show example.com
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

The specific part to focus on here are the `DNS Validation` fields:

```
DNS Validation Instructions = CNAME _acme-challenge.example.com => example.com.o055.flydns.net.
  DNS Validation Hostname     = _acme-challenge.example.com
  DNS Validation Target       = example.com.o055.flydns.net
```

Basically, the `Validation Hostname`, when looked up, should send requests to the `Validation Target`, a Fly.io-generated validation service. To do this, add the contents of the `Validation Instructions` to your DNS records; that is create a CNAME record which points the `_acme-challenge` subdomain to the `Validation Target`.

Once you have done that, wait as the validation and certificate issuing happens (check in with `fly certs check`). When complete, you'll be able to turn on the traffic whenever you are ready. You'll be able to do that either by setting the CNAME or by setting the A and AAAA records as described previously.

### Other commands

Finally, we should point out the other `fly certs` commands.

* `fly certs list` - Lists the hostnames which have been added to an application and for which certificates may have been obtained.
* `fly certs check hostname` - Triggers a check on the domain validation and DNS configuration for the given host and return results in the same format as `fly certs show`.
* `fly certs delete hostname` - Removes the hostname from the application, dropping the certificates in the process.

## Automating the certificate process

To illustrate how to automate the certificates API, we are going to show the flyctl command and the equivalent GraphQL request, wrapped in a compact easy-to-read Node application from our [fly-examples/hostnamesapi](https://github.com/fly-apps/hostnamesapi) repository.

### GraphQL API Notes

**Endpoints**: The Endpoint for the Fly.io GraphQL API is `https://api.fly.io/graphql`.

**Authentication**: All queries require an API token which be obtained by signing into the [Fly.io web dashboard](https://fly.io/dashboard/apps/), selecting **Account** ➡︎ **Settings** ➡︎ **Access Tokens** ➡︎ **Create Access Token**. Create a new token and carefully note the value; we suggest placing it in an environment variable such as `FLY_API_TOKEN` so it can be passed to applications. When used with the API, the token should be passed in an `Authorization` header with the value `Bearer <token value>`.

**IDs and Names**: Applications can be referred to by name or by ID. Currently the Application ID and Name are interchangeable. This will change in a future semantically significant version. To see how to query for ID and Name, see [getappbyid.js](https://github.com/fly-apps/hostnamesapi/blob/master/getappbyid.js) and [getappbyname.js](https://github.com/fly-apps/hostnamesapi/blob/master/getappbyname.js) in the example repository.

### Listing all the hosts of an application

**With flyctl**: `fly certs list`

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

**With flyctl**: `fly certs add <hostname>`

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

**With flyctl**: `fly certs show hostname`

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

**With flyctl**: `fly certs check hostname`

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

**With flyctl**: `fly certs delete hostname`

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
### Certificate creation or validation seems to hang, stall or fail

Let's Encrypt™ is a free, automated, and open certificate authority that Fly.io uses to issue TLS certificates for custom domains. However, Let's Encrypt™ imposes certain rate limits to ensure fair usage. If you encounter issues when creating or validating a certificate for a custom domain on Fly.io, it's possible that you've hit these rate limits.

The following [rate limits](https://letsencrypt.org/docs/rate-limits/) from Let's Encrypt™ apply:

* **Certificates per Registered Domain**: 50 per week
* **Duplicate Certificate limit**: 5 per week
* **Failed Validation limit**: 5 failures per hostname, per hour

Note that certificate renewals don’t count against your **Certificates per Registered Domain** limit.

If you encounter issues when adding or validating a certificate for a custom domain on Fly.io, you can use the following methods to troubleshoot:

* **Use [Let's Debug](https://letsdebug.net/)**: A diagnostic tool/website to help figure out why you might not be able to issue a certificate for Let's Encrypt™. Using a set of tests, it can identify a variety of issues, including: problems with basic DNS setup, problems with nameservers, rate limiting, networking issues, CA policy issues and common website misconfigurations.
* **Wait and Retry**: If you've hit a rate limit, you'll need to wait until the rate limit window passes before you can successfully create or validate a certificate again. We don’t have a way to reset it.

Remember, the best way to avoid hitting rate limits is to use staging environments and domains for testing and development, and to carefully plan your certificate issuance to stay within the limits. Avoid failed validation by ensuring that your DNS records are correctly configured, with no conflicting records.

If you're building a platform on top of Fly.io, and you expect that your users will frequently delete and then recreate the same resources within a short window, consider implementing "soft delete" logic into your platform that retains the Fly.io resources for a period of time, negating the need to recreate certs frequently.

### I use Cloudflare, and there seems to be a problem issuing or validating my Fly.io TLS certificate

If you're using Cloudflare, you might be using their Universal SSL feature which inserts a TXT record of `_acme_challenge.<YOUR_DOMAIN>` for your domain. This can interfere with our certificate validation/challenge and you should [disable](https://developers.cloudflare.com/ssl/edge-certificates/universal-ssl/disable-universal-ssl/#disable-universal-ssl-certificate) this feature.

You can then verify that the change has propagated and the TXT record is no longer present by running `dig txt _acme-challenge.<YOUR_DOMAIN> +short`.

## Wrapping up

You have everything you need to either hand assign a custom domain to your Fly.io application or to create your own automated multi-domain proxy.
