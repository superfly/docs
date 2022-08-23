---
title: Security at Fly.io
layout: docs
nav: firecracker
---

Securing a major hosting platform like [Fly.io](http://Fly.io) is a hard problem, and we take it seriously.

<div class="callout">
**Reporting issues**: If you have a security concern, or believe you’ve found a vulnerability in any part of our infrastructure, please contact us. You can reach us at [**security@fly.io**](mailto:security@fly.io), and we can provide you with a Signal number if needed to convey sensitive information.
</div>

## Our Security Practice

**Corporate Security (“CorpSec”)**

CorpSec is the practice of making sure [Fly.io](http://Fly.io) team members have secure access to [Fly.io](http://Fly.io) company infrastructure, and that secured channels are the only exposed channels to [Fly.io](http://Fly.io). CorpSec controls are the primary concern of standards like SOC2.

- Access to our services and applications is gated on a SSO Identity Provider.
- We require strong, phishing-resistant 2FA in all enrolled IdP accounts.
- We rely on IdP-backed WireGuard with strict, default-deny, role-based access controls to access internal applications.
- We have centralized repositories of policy and audit controls, including team onboard and offboarding and access requests; we regularly audit access to internal systems.

## Process Controls: Network/Infrastructure Security (“InfraSec”)

InfraSec is the practice of ensuring a hardened, minimal attack surface for components we deploy on our network. Conventionally, modern InfraSec centers on “cloud security”; of course, we are ourselves a cloud provider, which makes the job more interesting.

- We run on our own hardware deployed in secure data centers like Equinix.
- Our platform networking runs over a WireGuard mesh with further BPF-based access controls. Everything is encrypted in transit, at multiple layers.
- Remote management is largely automated, and fully audited; remote access is done through an IdP-backed cert-based SSH system with transcript-level audit trails.
- [Fly.io](http://Fly.io) operates a large logging and metrics cluster (it’s a feature of our platform!).
- Our internal client/server services are locked down further with Mutual TLS. 
- We work with upstream traffic providers to perform automated and manual DDoS mitigation.
- Compute jobs at [Fly.io](http://Fly.io) are virtualized using Firecracker, the virtualization engine developed at AWS as the engine for Lambda and Fargate. 
- Customer information on databases and volumes at [Fly.io](http://Fly.io) is encrypted with the Linux LUKS block storage encryption secrets. 

## Application Security (“AppSec”)

AppSec is the practice of ensuring software is secure by design, secured during development, secured with testing and review, and securely deployed.

- Our software is built in memory-safe programming languages, including Rust (for our Anycast forwarding path) and Golang (for our deployment and control plane). 
- We make decisions that minimize our attack surface. Most interactions with [Fly.io](http://Fly.io) are well-described in a GraphQL API, and occur through flyctl, our open-source command-line tool.
- We perform internal code reviews with a modern, PR-based development workflow, and engage external testing firms to assess our software security.

## SOC2 and HIPAA

[We have our SOC2 Type I](https://fly.io/blog/soc2-the-screenshots-will-continue-until-security-improves/) where we've documented a bunch of these controls. Additionally, we've detailed a number of controls for folks exploring [running HIPAA-compliant applications on our platform](https://fly.io/docs/about/healthcare).

## Questions?

[Email us!](mailto:security@fly.io)