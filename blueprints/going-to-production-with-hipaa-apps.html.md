---
title: Going to Production with HIPAA Apps
layout: docs
nav: firecracker
---

Fly.io was built by security researchers from the ground up to be both productive and secure, making it a viable host for HIPAA-compliant production healthcare applications.

This guide will run a developer or operations engineer through the process of evaluation Fly.io's security for HIPAA apps, launching a pilot application, signing a BAA, and deploying to production.

## Review security requirements

Fly.io takes a "principle of least privileged" approach to security. Here are the highlights of what healthcare app developers get out of the box on Fly.io:

- Each application is launched in its own private network and encrypted in transit [using WireGuard](https://fly.io/blog/our-user-mode-wireguard-year/).
- Docker workloads are isolated at the kernel hardware level with the [Firecracker VM runtime on Fly's own metal](https://fly.io/blog/fly-machines/) hosted in secure data centers.
- Data is stored on [encrypted NVMe volumes](https://fly.io/docs/reference/volumes/) for speed and security.
- [Control the physical region](https://fly.io/docs/reference/regions/) where data is physically stored with a few commands.
- Fly automatically detects the type of app you're provisioning to expose ports to the public internet, which is written to an auditable configuration file.
- A [secrets manager](https://fly.io/docs/reference/secrets/) that encrypts API credentials and environment variables.

There's more detail at [https://fly.io/docs/about/healthcare](https://fly.io/docs/about/healthcare/) and [https://fly.io/security](https://fly.io/security). If you have additional questions about Fly.io's security infrastructure & practices, please [reach out](mailto:sales@fly.io).

## Launch pilot application

The fastest way to deploy a pilot application is to run through the [Fly.io Speedrun](https://fly.io/speedrun/). The speed run covers:

- Sign up for [a Fly account](https://fly.io/app/sign-up).
- Install the `flyctl` [command line tool](https://fly.io/docs/hands-on/install-flyctl/), which is used to provision server resources on Fly, deploy your application, and other administrative functions.
- Run `fly launch` from the root of your project to provision resources and deploy your application.

If your free demo account doesn't have enough resources for your pilot application you may [upgrade to a paid plan](https://fly.io/docs/about/pricing/) or [contact sales](mailto:sales@fly.io).

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
Hong Kong, Hong Kong                          hkg   ✓
Johannesburg, South Africa                    jnb
London, United Kingdom                        lhr   ✓
Los Angeles, California (US)                  lax   ✓
Madrid, Spain                                 mad
Miami, Florida (US)                           mia
Montreal, Canada                              yul
Mumbai, India                                 bom           ✓
Paris, France                                 cdg   ✓
Phoenix, Arizona (US)                         phx
Querétaro, Mexico                             qro   ✓
Rio de Janeiro, Brazil                        gig
San Jose, California (US)                     sjc   ✓                           ✓
Santiago, Chile                               scl   ✓
Sao Paulo, Brazil                             gru
Seattle, Washington (US)                      sea   ✓
Secaucus, NJ (US)                             ewr   ✓
Singapore, Singapore                          sin   ✓
Stockholm, Sweden                             arn
Sydney, Australia                             syd   ✓                           ✓
Tokyo, Japan                                  nrt   ✓
Toronto, Canada                               yyz   ✓
Warsaw, Poland                                waw
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

Fly.io's [secret manager stores](https://fly.io/docs/reference/secrets/) your application's API credentials and secrets in a secure vault. The contents remain encrypted and are only available from running Machine instances as environment variables.

### Ask additional questions if there's something we didn't cover

If at any time during your evaluation of Fly you have questions about the infrastructure, security, or service terms you can ask in the community forums or [email Fly.io with your questions](mailto:sales@fly.io).

## Ready for production? Sign a BAA

When you're ready to start deploying HIPAA apps, you'll need to do some paperwork (don't worry, we use digital signatures) to make sure everything is compliant.

- [Choose a plan](https://fly.io/plans) that includes HIPAA/BAA documents.
- Sign in to the dashboard and request a signed BAA at [https://fly.io/dashboard/personal/documents](https://fly.io/dashboard/personal/documents) or [contact us](mailto:sales@fly.io) and we'll help.

## Deploy to production

Once you've evaluated Fly.io and have a BAA, it's time to go to production.

### Provision production in an isolated environment

Ensure the production environment to be separate from the test and staging environments used to test this application.

Fly uses "organizations" to control access to "applications". Since production environments require their own access control, we'll create a new organization that will contain all of our production applications.

```bash
# Replace $MYORG with the name of your organization
$ fly orgs create $MYORG-production
```

You'll walk through the steps of creating a new organization within Fly.io. You'll also have to add a new payment method and select the appropriate plan for the new organization. If you need help during this process or have questions about how a plan spans multiple organizations, [please reach out](mailto:sales@fly.io).

Next we have to make sure we have a `fly.toml` file per environment:

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

### Troubleshooting

If you run into problems during or after deploy you can run `fly logs --path fly.production.yml` to see errors your application may be logging.

### Create SSL certificate and custom domain

Next you'll want to point a domain name to the new production environment via `fly certs`.

```bash
$ fly certs add myappname.com --path fly.production.yml
```

The output of the command includes the information you need to update DNS records to point to the application on Fly.io

### Deploy application

Finally run `fly deploy --path fly.production.yml`to deploy your application.
