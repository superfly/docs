---
title: Going to Production with Healthcare Apps
layout: docs
nav: firecracker
redirect_from: /docs/blueprints/going-to-production-with-hipaa-apps
---

Fly.io was built by security researchers from the ground up to be both productive and secure, making it a great home for HIPAA-compliant production healthcare applications for productive teams that ship often.

This blueprint runs a developer or operations engineer through the process of evaluating Fly.io's security for HIPAA healthcare apps, launching a pilot application, signing a Business Associate Agreement (BAA), and deploying to production.

## HIPAA and Fly.io Primer

The Health Insurance Portability and Accountability Act (HIPAA) sets the standard for protecting sensitive patient data. Any company that processes protected health information (PHI) must ensure that all the required physical, network, and process security measures are in place and followed.

Fly.io takes a "principle of least privilege" approach to security. Here are the highlights of what healthcare app developers get out of the box on Fly.io:

### Data Protection and Encryption

HIPAA requires that PHI be encrypted both in transit and at rest to prevent unauthorized access:

- **In Transit**: Fly.io uses [WireGuard](https://fly.io/blog/our-user-mode-wireguard-year/) to encrypt data as it moves between networks, ensuring compliance with HIPAA's transmission security requirements.
- **At Rest**: Fly.io ensures data at rest is secured on [encrypted NVMe user volumes](https://fly.io/docs/volumes/), aligning with the encryption standards required by HIPAA for storage security.

### Access Control

Access to PHI must be limited to authorized personnel only, which is managed through:

- **Network Isolation**: Each application on Fly.io runs within its own private network by default, reducing the risk of unauthorized access.
- **Secrets Management**: Fly.io provides a [secrets manager](/docs/apps/secrets/) for storing and handling API credentials and environment variables securely, ensuring that sensitive information is accessible only to authorized applications.
- **Isolated Application Environments**: Fly.io allows organizations to create separate organizations for different environments, ensuring that production environments are isolated from test and staging environments.
- **Workload Isolation:** [Docker workloads on Fly.io are isolated at the kernel hardware level through the Firecracker VM runtime](https://fly.io/blog/fly-machines/). These workloads are hosted in secure data centers on Fly.io's dedicated hardware, ensuring HIPAA compliance by minimizing the risk of unauthorized access and maintaining strict control over PHI data.

### Audit Controls

HIPAA demands that you implement hardware, software, and procedural mechanisms that record and examine activity in systems containing PHI:

- **Logging and Monitoring**: Fly.io allows organizations to monitor and log access and usage, helping comply with HIPAA’s information system activity review requirements.
- **Version-Controlled Configuration**: Fly.io uses a Dockerfile and fly.toml configuration file for managing application deployments. These files can be checked into version control systems, like Github, allowing for comprehensive audit trails of infrastructure changes. This capability supports HIPAA's mandates for traceability and accountability in the modification and management of systems handling PHI.

### Data Integrity

To comply with HIPAA, entities must ensure that PHI is not altered or destroyed in an unauthorized manner:

- **Data Storage and Backup**: Fly.io’s infrastructure provides robust data integrity controls, including [regular snapshots](https://fly.io/docs/volumes/volume-manage/) of [encrypted volumes](https://fly.io/docs/volumes/overview/#volume-encryption) to prevent data loss.
- **Reproducible Deployments**: Fly.io's use of Docker ensures that application deployments are reproducible and can be locked down to a mostly read-only state. This reduces the likelihood of unauthorized modifications to application environments, meeting HIPAA's requirements for protecting PHI from unauthorized alteration or destruction.

### Physical Security

Physical access to data centers where PHI is stored must be controlled:

- **Data Centers**: Fly.io hosts services in secure data centers with restricted access, surveillance, and environmental controls, ensuring the physical security of the hardware that stores and processes PHI.
- **Regional Data Control**: Fly.io allows users to control the [physical region](https://fly.io/docs/reference/regions/) where data is stored and processed using simple commands, facilitating compliance with data residency requirements of HIPAA by ensuring PHI is stored within designated secure regions, such as the United States.

There's more detail at [https://fly.io/docs/about/healthcare](https://fly.io/docs/about/healthcare/) and [https://fly.io/security](https://fly.io/security). If you have additional questions about Fly.io's security infrastructure & practices, please [reach out](mailto:sales@fly.io).

## Launch pilot application

The fastest way to deploy a pilot application is to run through the [Fly.io Speedrun](https://fly.io/speedrun/).

If your free demo account doesn't have enough resources for your pilot application, you may [upgrade to a paid plan](https://fly.io/docs/about/pricing/) or [contact us](mailto:sales@fly.io) to make other arrangements.

### Specify deployment regions

Fly automatically detects which of its 30+ regions around the globe is closest to you as your default data region.

If the default region is not where you want to host your application, run `fly platform regions` to see the most recent list of regions.

```bash
fly platform regions
NAME                                          CODE  GATEWAY LAUNCH PLAN + ONLY  GPUS
Amsterdam, Netherlands                        ams   ✓                           ✓
Ashburn, Virginia (US)                        iad   ✓                           ✓
Atlanta, Georgia (US)                         atl
Bogotá, Colombia                              bog
Boston, Massachusetts (US)                    bos
Bucharest, Romania                            otp
Chicago, Illinois (US)                        ord   ✓
Dallas, Texas (US)                            dfw   ✓
Denver, Colorado (US)                         den
Ezeiza, Argentina                             eze
Frankfurt, Germany                            fra   ✓       ✓
Guadalajara, Mexico                           gdl
# ... Lots more regions...
```

Then select your desired region:

```
$ fly regions add ord
```

And remove undesired regions as well:

```bash
$ fly regions remove sin
```

Your application will automatically be deployed to the regions specified and communications between regions happen over a private, encrypted WireGuard network.

### Add API keys and credentials to the Secrets Manager

Fly.io's [secret manager stores](/docs/apps/secrets/) your application's API credentials and secrets in a secure vault. The contents remain encrypted and are only available from running Machine instances as environment variables.

### Talk to our solution architects if you have questions

If at any time during your evaluation of Fly you have questions about the infrastructure, security, or service terms you can ask in the community forums or [email Fly.io with your questions](mailto:sales@fly.io).

## Deploy to production

Once you've evaluated Fly.io and have a BAA, it's time to go to production. The remainder of this guide will walk you through how to setup an isolated production environment, control access, and deploy your application.

### Sign a Business Associate Agreement (BAA)

When you're ready to start deploying HIPAA apps, you'll need to do some paperwork (don't worry, we use digital signatures) to make sure everything is compliant.

- [Choose the Compliance Package](https://fly.io/compliance) that includes HIPAA/BAA documents.
- Sign in to the dashboard and request a signed BAA at [https://fly.io/dashboard/personal/compliance](https://fly.io/dashboard/personal/compliance) or [contact us](mailto:sales@fly.io) and we'll help.

### Provision an isolated production environment

Ensure the production environment to be separate from the test and staging environments used to test this application.

Fly uses "organizations" to control access to "applications". Since production environments require their own access control, we'll create a new organization that will contain all of our production applications.

```bash
# Replace $MYORG with the name of your organization
$ fly orgs create $MYORG-production
```

You'll walk through the steps of creating a new organization within Fly.io. You'll also have to add a new payment method and select the appropriate plan for the new organization. If you need help during this process or have questions about how a plan spans multiple organizations, [please reach out](mailto:sales@fly.io).

### Invite team members to production environment

Grant access to team members who may have access to the production environment:

```bash
$ fly orgs invite somebody@$MYORG.com --org $MYORG-production
```

### Launch application

Next, ensure you have a `fly.toml` file for each environment:

```bash
$ cp fly.toml fly.staging.toml
$ mv fly.toml fly.production.toml
```

Run `fly launch` to provision the production environment.

```bash
# Replace $MYAPPNAME with the name of your app
$ fly launch --name $MYAPPNAME-production --path fly.production.yml --org $MYORG-production
An existing fly.toml file was found for app $MYAPPNAME
? Would you like to copy its configuration to the new app? (y/N) y
```

You'll be asked to copy the configuration file. Select `y` assuming you want to use the same settings from the `fly.toml` file that was formerly staging. You'll want to commit these `fly.toml` files to your repo.

If you run into problems during or after deploy you can run `fly logs --path fly.production.yml` to see errors your application may be logging.

### Create SSL certificate and custom domain

Next, point a domain name to the new production environment via `fly certs`.

```bash
$ fly certs add myappname.com --path fly.production.yml
```

The output of the command includes the information you need to update DNS records to point to the application on Fly.io

### Deploy application

Finally run `fly deploy --path fly.production.yml` to deploy your application, then open your application in your browser to ensure that it's up and running.

## Wrap-up

Fly.io is a secure, productive platform for deploying HIPAA-compliant healthcare applications. The platform provides the necessary security controls and features to ensure that PHI is protected in accordance with HIPAA requirements while giving development teams the flexibility to ship often and scale quickly.
