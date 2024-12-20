---
title: Fly.io security practices and compliance
layout: docs
nav: firecracker
---

<figure>
  <img src="/static/images/dark-arts.png" alt="Illustration by Annie Ruygt of a dark magic book with headline Fly Security" class="max-w-lg">
</figure>

<div class="important icon">
**Report an issue**: If you have a security concern, or believe you’ve found a vulnerability in any part of our infrastructure, please contact us. You can reach us at [**security@fly.io**](mailto:security@fly.io), and we can provide you with a Signal number if needed to convey sensitive information.
</div>

## Corporate Security (“CorpSec”)

CorpSec is the practice of making sure Fly.io team members have secure access to Fly.io company infrastructure, and that secured channels are the only exposed channels to Fly.io. CorpSec controls are the primary concern of standards like SOC2.

- Access to our services and applications is gated on an SSO Identity Provider.
- We require strong, phishing-resistant 2FA in all enrolled IdP accounts.
- We rely on IdP-backed WireGuard with strict, default-deny, role-based access controls to access internal applications.
- We have centralized repositories of policy and audit controls, including team onboard and offboarding and access requests; we regularly audit access to internal systems.

## Process Controls: Network/Infrastructure Security (“InfraSec”)

InfraSec is the practice of ensuring a hardened, minimal attack surface for components we deploy on our network. Conventionally, modern InfraSec centers on “cloud security”; of course, we are ourselves a cloud provider, which makes the job more interesting.

- We run on our own hardware deployed in secure data centers like Equinix.
- Our platform networking runs over a WireGuard mesh with further BPF-based access controls. Everything is encrypted in transit, at multiple layers.
- Remote management is largely automated, and fully audited; remote access is done through an IdP-backed cert-based SSH system with transcript-level audit trails.
- Fly.io operates a large logging and metrics cluster (it’s a feature of our platform!).
- Our internal client/server services are locked down further with Mutual TLS.
- We work with upstream traffic providers to perform automated and manual DDoS mitigation.
- Compute jobs at Fly.io are virtualized using Firecracker, the virtualization engine developed at AWS as the engine for Lambda and Fargate.
- Customer information on databases and volumes at Fly.io is encrypted with the Linux LUKS block storage encryption secrets.

## Application Security (“AppSec”)

AppSec is the practice of ensuring software is secure by design, secured during development, secured with testing and review, and securely deployed.

- Our software is built in memory-safe programming languages, including Rust (for our Anycast forwarding path) and Golang (for our deployment and control plane). 
- We make decisions that minimize our attack surface. Most interactions with Fly.io are well-described in a GraphQL API, and occur through flyctl, our open-source command-line tool.
- We perform internal code reviews with a modern, PR-based development workflow, and engage external testing firms to assess our software security.

## Vulnerability Remediation

Vulnerabilities that directly affect Fly.io's systems and services will be patched or otherwise remediated within a timeframe appropriate for the severity of the vulnerability, subject to the public availability of a patch or other remediation instructions.

**Severity: Timeframe**
* Critical:	24 hours
* High:	1 week
* Medium:		1 month
* Low: 3 months
* Informational:	As necessary

If there's a severity rating that accompanies a vulnerability disclosure, we'll generally rely on that as a starting point, but may upgrade or downgrade the severity in our best judgement.

## SOC2 and HIPAA

[We have our SOC2 Type 2](/blog/soc2-the-screenshots-will-continue-until-security-improves/) where we've documented a bunch of these controls. Additionally, we've detailed a number of controls for folks exploring [running HIPAA-compliant applications on our platform](/docs/about/healthcare).

## Questions?

[Email us!](mailto:security@fly.io)
