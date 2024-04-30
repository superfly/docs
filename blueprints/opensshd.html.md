---
title: Run an ssh server
layout: docs
sitemap: false
nav: firecracker
author: rubys
categories:
  - ssh
date: 2024-01-14
redirect_from: /docs/app-guides/opensshd/
---

A number of tools allow you to interact with your server over ssh. These tools are useful for tasks such as
copying files ([rsync](https://rsync.samba.org/+external), [scp](https://en.wikipedia.org/wiki/Secure_copy_protocol+external), [sshfs](https://github.com/libfuse/sshfs#sshfs+external)), 
editing ([emacs](https://www.gnu.org/software/emacs/manual/html_node/emacs/Remote-Files.html+external), [vim](https://www.vim.org/scripts/script.php?script_id=1075+external), [vscode](https://code.visualstudio.com/docs/remote/ssh+external)), and
deployment ([ansible](https://www.ansible.com/+external), [github actions](https://github.com/marketplace/actions/ssh-deploy+external), and [kamal](https://kamal-deploy.org/+external)).

One way to use these tools is to [set up a wireguard VPN](https://fly.io/docs/reference/private-networking/#install-your-wireguard-app) and
[issue a new SSH credential](https://fly.io/docs/flyctl/ssh-issue/).  This may be impractical for some use cases (example: github actions).

As an alternative, you can configure and deploy an ssh server on your machine(s).  This guide will walk you through the process.

Before proceeding, a **caution**: unless you are **certain** that all of the clients will access this service through IPv6, you will need a [dedicated IPv4](https://fly.io/docs/reference/services/#dedicated-ipv4) address.

## Install and configure opensshd

Most Docker images are ultimately based on Debian, so the following will work.  Adjust as necessary for other operating systems (example: [Alpine](https://www.alpinelinux.org/+external)).

```Dockerfile
RUN apt-get update \
 && apt-get install -y openssh-server \
 && cp /etc/ssh/sshd_config /etc/ssh/sshd_config-original \
 && sed -i 's/^#\s*Port.*/Port 2222/' /etc/ssh/sshd_config \
 && sed -i 's/^#\s*PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config \
 && mkdir -p /root/.ssh \
 && chmod 700 /root/.ssh \
 && mkdir /var/run/sshd \
 && chmod 755 /var/run/sshd \
 && rm -rf /var/lib/apt/lists /var/cache/apt/archives
```

Notes:
 * This runs `sshd` internally on port 2222.  This is because by default `sshd` listens on all network interfaces,
   but fly.io machines already are listening on port 22 on the private network (ipv6) interface, so sshd will
   either complain or fail to start.  Additionally, `fly deploy` will attempt to verify that your application is
   listening on the interfaces your application exports, and will incorrectly treat fly's listening on port 22 as
   evidence that your application is up and running.
 * Password Authentication is disabled.  This avoids unnecessary prompts.  We will be using SSH keys instead.
 * The above assumes `root` user.  If your application is running under a different user, replace `/root` with the
   home directory of that user (example: `/home/rails`).

## Map internal port 2222 to external port 22

Add the following to `fly.toml`:

```
[[services]]
  internal_port = 2222
  protocol = "tcp"
  auto_stop_machines = true
  auto_start_machines = true
  [[services.ports]]
    port = 22
```

This section is needed even if the internal and external ports are the same.

Notes:

* `internal_port` needs to match the port you selected in the previous step.
* `port` can be any available port.  `22` is the [default port](https://www.ssh.com/academy/ssh/port+external) for ssh,
  and the one that most applications expect to be used.
* Like with your web server port, your server can be configured to spin down when idle and restart when accessed.
  Feel free to adjust `auto_stop_machines` and `auto_start_machines` if your needs differ.

## Start the openssh server

There are a [number of ways to run multiple processes](../multiple-processes/).  The most straightforward
way to start sshd before your application.  Locate the `ENTRYPOINT` in your Dockerfile.  If you don't have
one, create a script in your application directory, name that script as the ENTYRPOINT, and make it
executable.

An example of such a script:

```bash
#!/bin/bash -e

/usr/sbin/sshd

exec "$@"
```

Note: the above needs to be run as root.  If your Dockerfile specifies another `USER`, you can work around this
by installing and configuring `sudo` and then removing sudo access before running your main process.

For example, if your userid is `rails`, you would add the following to your Dockerfile:

```Dockerfile
RUN apt-get install -y sudo && \
    echo "%rails ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
```

And then update your entrypoint script:

```bash
sudo /usr/sbin/sshd
sudo sed -i "/^%rails/d" /etc/sudoers
```

The above commands will start `sshd` as root, then remove sudo access from your unpriviledged userid.

## Upload your ssh key

First, locate your ssh key.  You can create a new key using [`ssh-keygen`](https://www.ssh.com/academy/ssh/keygen+external),
Or you can use an existing one: look inside the `.ssh` folder in your home directory for a file with a name like `id_rsa.pub`.

Once located, there are multiple ways to proceed.  Following you will find two ways.  Depending on the framework your
application uses, you may have other ways to store credentials or environment variables.  As this step only deals with
public keys, one need not take extraordinary measures to prevent leakage.

### Alternative 1: Set and use a secret

```bash
fly secrets set "AUTHORIZED_KEYS=$(cat ~/.ssh/id_rsa.pub)"
```

Powershell users will want to use the following instead:

```powershell
fly secrets set "AUTHORIZED_KEYS=$(Get-Content $HOME\.ssh\id_rsa.pub)"
```

Next update your entrypoint script to contain the following:

```bash
echo $AUTHORIZED_KEYS > /root/.ssh/authorized_keys
```

If you are running with sudo, you would want to do the following instead:

```bash
echo $AUTHORIZED_KEYS | sudo tee /root/.ssh/authorized_keys > /dev/null
```

### Alternative 2: Copy from a volume

If you have a volume and if you can arrange to upload the file
there, you can directly copy it as a part of your entrypoint script.

```bash
cp /volume/.ssh/authorized_keys /root/.ssh
```

## [RECOMMENDED] Make ssh host keys stable

The first time you ssh into a server you will be presented with a fingerprint for the server you are accessing.
If you accept that fingerprint, it will be added to your `known_hosts` file in your `.ssh` folder.  This key
is generated when you install `openssh-server`.

The issue arises when you redeploy your application.  If something changes (or your docker cache expires),
the installation of `openssh-server` may be rerun, and new keys will be generated.  To avoid these keys from
being used, you can capture and restore the keys.

The following assumes that you have a [volume](../../apps/volume-storage/) mounted at `/volume`, and an entrypoint
script.

```bash
mkdir -p /volume/.ssh

if [[ "$(ls /volume/.ssh/*_key)" = "" ]]; then
  cp /etc/ssh/*_key /volume/.ssh
else
  cp /volume/.ssh/*_key /etc/ssh
fi
```

Notes:
* These keys are expected to be private, so if you go with an alternate route, make sure that these values are
  not committed to a public repository unencrypted.
* If you are running with `sudo`, you need to add `sudo` before the `mkdir`, the `ls` and both of the `cp` statements.
* If you have multiple machines, you may want all of them to [share the same keys](https://security.stackexchange.com/a/89621+external).

## [OPTIONAL] Configure client user and aliases

Your full dnsname may be a mouthful, the user the application runs under may be different than the one you use on your laptop.
the port you expose may be non-standard, or you may have multiple machines and a desire to be able to ssh into a specific one.

If any of these apply to you, you can create or update a file named [`config`](https://www.ssh.com/academy/ssh/config+external) in your `.ssh` directory.
Following is an example that illustrates addressing a number of the above cases: 

```config
Host appname
  Hostname appname.fly.dev
  User rails
  Port 2222
Host *.appname
  HostName %h.internal
  ProxyJump rails@appname.fly.dev:2222
  User rails
  Port 2222
```

Additionally, if you want to avoid the fingerprint checking, you can add the following to each of the `Host` entries:

```config
StrictHostKeyChecking no
```
