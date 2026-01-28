---
title: "Understanding Cloudflare"
layout: docs
nav: firecracker
author: kaelyn
date: 2025-07-16
---

<figure>
<img src="/static/images/understanding-cloudfare.png" alt="Illustration by Annie Ruygt of a big cloud with Fly balloons exiting from inside it" class="w-full max-w-lg mx-auto">
</figure>

Many Fly.io apps use Cloudflare—sometimes just for DNS, sometimes with proxying enabled, and sometimes for both. This guide covers the supported configurations, how to set them up, and what to watch out for when using Cloudflare with Fly.io.

## DNS-only setup

This is the simplest and most reliable way to use Cloudflare with Fly.io. To configure a DNS-only setup:

1. Point your domain to your Fly.io app using an `AAAA` record for the IPv6 address and an `A` record for the IPv4 address.
2. Alternatively, use a `CNAME` record pointing to your app's unique target, shown in your certificate setup instructions.
3. Disable the Cloudflare proxy (select "grey cloud") for these records.
4. SSL certificates will be handled by Fly.io automatically using Let's Encrypt.

## CDN proxy setup ("orange cloud")

Enabling Cloudflare's proxy gives you caching and DDoS protection, but it also changes how SSL certificates work. Cloudflare terminates TLS traffic, which interferes with Fly.io's default TLS-ALPN-01 certificate issuance process.

The recommended approach for using Cloudflare's CDN proxy is to configure it to forward HTTP requests, which allows HTTP-01 challenges to work properly. To configure a CDN proxy setup:

1. Create an `AAAA` record only pointing to your Fly.io app's IPv6 address.
2. Do not add `A` or `CNAME` records for the hostname. If you previously had an `A` record pointing elsewhere (such as a legacy server or placeholder), remove it, even if the correct `AAAA` record is present. Having any `A` record alongside the `AAAA` can confuse Let’s Encrypt validation and prevent certificate renewal.
3. Enable the Cloudflare proxy (orange cloud).
4. Set SSL mode in Cloudflare to Full (strict).
5. Enable Always Use HTTPS in Cloudflare.

<div class="callout">
**Important:** This setup allows Fly.io to handle HTTP-01 validation and issue certificates automatically.
</div>


### Using the DNS-01 challenge (manual certificate setup)

If the HTTP-01 challenge doesn't work for your setup, you can fall back to using a DNS-01 challenge to manually issue a certificate.

To do this:
1. Use the Fly.io dashboard or run:

```bash
fly certs create <your-domain>
```

2. Add the required TXT records to Cloudflare when prompted.
3. The certificate will issue once DNS propagation is complete.

### How Fly.io handles TLS and certificate management

TLS certificates are provisioned automatically using Let’s Encrypt. We handle renewals in advance and manage rate limits carefully per hostname, so you don’t need to worry about expiration dates or throttling.

We don’t currently support bringing your own ACME provider like ZeroSSL or SSL.com into our provisioning flow. If you prefer to terminate TLS yourself and handle your own ACME HTTP challenges, you can do that by passing TCP through to your Fly app. The Fly Proxy won’t interfere with these challenges, and there's no IPv6 requirement if you're managing this independently.

Both approaches are valid, but we recommend using the platform's built-in TLS termination and certificate management, especially as certificate validity periods get shorter.

## Common issues to watch for

- Cloudflare's Universal SSL may interfere with DNS-01 challenges. Disable it or use HTTP-01 instead to avoid this.
- Check that your domain allows Let's Encrypt with a CAA record like:

```
   example.com.  CAA  0 issue "letsencrypt.org"
```

- Only one application should manage certificates for a domain. Using more than one can cause conflicts.
- Let's Encrypt has limits. Check the certificate status tab in the Fly.io dashboard if issuance fails.

<div class="callout">
**Cloudflare Universal SSL Ghost Records Issue:** If you're using Cloudflare and Let's Encrypt can't issue a certificate, you may be encountering phantom _acme-challenge TXT records. This happens when Cloudflare's Universal SSL automatically inserts hidden ACME challenge TXT records that don't appear in your DNS dashboard but show up when you run `dig TXT _acme-challenge.yourdomain.com`. These ghost records interfere with Let's Encrypt's validation process.

To resolve this:
1. Go to Edge Certificates in Cloudflare's SSL/TLS settings and disable Universal SSL.
2. Purge cache ("Purge Everything" in Cloudflare) and/or enable Development Mode.
3. Wait several minutes for DNS cache to clear, then confirm with `dig` that only your intended TXT record is present.
4. Retry certificate issuance from Fly.io.
</div>

## Tools for debugging

These tools can help when diagnosing certificate or DNS issues:

- [crt.sh](https://crt.sh/): Check issued certificates.
- [DNSChecker](https://dnschecker.org/): Confirm DNS propagation.
- [Let's Debug](https://letsdebug.net/): Analyze certificate validation issues.
- dig: Inspect DNS records from the command line.

For example:

```bash
dig AAAA your-app.example.com

dig TXT _acme-challenge.your-app.example.com
```

## Related topics

- [Custom domain guide](https://fly.io/docs/networking/custom-domain/)
- [Custom domain API reference](https://fly.io/docs/networking/custom-domain-api/)
- [flyctl certs commands](https://fly.io/docs/flyctl/certs/)
