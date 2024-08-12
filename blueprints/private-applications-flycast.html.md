---
title: Run private apps with Flycast
layout: docs
sitemap: true
nav: firecracker
author: xe
categories:
  - networking
date: 2024-06-17
---

<center><iframe width="600" height="315" src="https://www.youtube-nocookie.com/embed/PR0rzkwKwFA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></center><br />

## Intro

A lot of the time your applications are made to be public and shared with the world. Sometimes you need to be more careful. When you deploy your apps on Fly.io, you get a private network for your organization. This lets your applications in other continents contact each other like they were in the same room.

Sometimes you need a middle ground between fully public apps and fully private apps. [Flycast](/docs/networking/flycast/) addresses are private but global IPv6 addresses inside your private network that go through the Fly Proxy, so you get all of the load management and Machine waking powers that you get for free with public apps.

This blueprint covers what Flycast is, when and why you’d want to use it, and shows you how to create an instance of Ollama that you can connect to over Flycast.

## What is Flycast?

Before we get started, let’s talk about Flycast and when you would want to use it. In general we can split every kind of Fly App into two categories: public apps and private apps.

A public app is what you’d expose to the public Internet for your users. These are usually hardened apps that allow users to do some things, but have access limitations that prevent them from stepping outside their bounds. These are mostly programs that listen over HTTP for browsers to interact with. Your users connect to a public app through the platform router via the .fly.dev domain or whatever other domain you’ve set up.

A private app is something internal, like a database server or a worker queue. These are things that run in the background and help you get things done, but are intentionally designed to NOT be exposed to the public Internet. You wouldn’t want to expose your Postgres or Valkey servers to anyone, would you?

However, with a fully private app, all connections go directly to the Machines via their .internal addresses, so you have to keep them running 24/7 to maintain connectivity. This is fine for services like database engines where you want them to be running all the time, but what about an admin panel? You want your admin panel to be separate from your main app so that users can ever get into it, even by accident, but you also want it to shut down when it’s not in use.

Flycast exists for this middle category of apps. With Flycast, your apps are only visible over your organization’s private network, but any traffic to them goes through the proxy so they can turn on when you need them and turn off when you don’t. This allows your administrative panels to be physically separate so that users can’t access them.

When you want to connect to an app via Flycast, you connect to `appname.flycast`.

### Security note

Just a heads-up. In general, it’s a bad idea to assume that network access barriers like Flycast or NAT are security layers. At best, this is an obfuscation layer that makes it more difficult for attackers to get into private applications. Flycast is not a replacement for authentication in your private applications. With Flycast, you don’t know _who_ a request is coming from, but you do know that it’s coming from _something_ or _someone_ in your private network.

One of the biggest platform features that uses Flycast out of the box is Fly Postgres. Even though Flycast addresses are local to your private network, Fly Postgres still configures usernames and passwords for your database.

## Goal

We'll show Flycast off by setting up an instance of [Ollama](https://ollama.com+external).

Ollama is a program that wraps large language models and gives you an interface like Docker so that you can run open-weights large language models privately on your own device. Large language models are computationally expensive to run, so being able to offload them to a GPU-powered Fly Machine means you can hack all you want without burning up your precious battery life.

Ollama doesn’t ship with authentication by default. When you create an instance of Ollama, anyone can access it without entering in a username, password, or API key. This is fine for running your models on your own computer; but it means that if you expose it to the internet, anyone can use it and run models whenever they want. This could rack up your bill infinitely.

This is where Flycast comes in. Flycast lets you run a copy of Ollama on your private network so that you and your apps can access it, but nobody else. Flycast also lets you have the platform turn off your Ollama server when you’re not using it, which will save you money. This fits into that middle ground case that Flycast covers perfectly.

## Prerequisites

To get started, you need to do the following:

- [sign up or sign in](/docs/getting-started/sign-up-sign-in/) to Fly.io
- [install flyctl](/docs/flyctl/install/) (the Fly CLI)

If you want to interact with your Flycast apps&mdash;like an Ollama instance&mdash;from your computer, you’ll need to [jack into your private network with WireGuard](/docs/blueprints/connect-private-network-wireguard/).

## Steps

Create a new folder on your computer called `ollama`. This is where we’ll put the Ollama configuration. Open a terminal in that folder and run the fly launch command:

```
fly launch --from https://github.com/fly-apps/ollama-demo --no-deploy
```

This command creates a new fly app from the [`ollama-demo` template](https://github.com/fly-apps/ollama-demo+external) and tells the flyctl command to not deploy it after you create the app. If we don’t do this, then the platform will create public IPv4 and IPv6 addresses, which will make this a public app. The name you choose when you create your app will be used to connect to your app over Flycast.

Next, allocate a Flycast address for your app with the `fly ips allocate-v6` command:

```
$ fly ips allocate-v6 --private
```

Now you can deploy the app with the `fly deploy` command:

```
$ fly deploy
```

After that finishes, you can see the list of IP addresses associated to an app with `fly ips list`:

```
$ fly ips list
VERSION	IP                	TYPE   	REGION	CREATED AT
v6     	fdaa:3:9018:0:1::7	private	global	23h12m ago

Learn more about [Fly.io public, private, shared and dedicated IP addresses](/docs/reference/services/#ip-addresses).
```

This app only has one IP address: a private Flycast IPv6 address. If had public IP addresses, it'd look like this:

```
$ fly ips list -a recipeficator
VERSION	IP                    	TYPE              	REGION	CREATED AT
v6     	2a09:8280:1::37:7312:0	public (dedicated)	global	May 30 2024 13:51
v4     	66.241.124.113        	public (shared)   	      	Jan 1 0001 00:00
```

Now that we've proven it's private, let’s open an interactive shell Machine to play around with Flycast. Create the shell Machine with `fly machine run`:

```
$ fly machine run --shell ubuntu
root@e784127b51e083:/#
```

The Ubuntu image we chose is very minimal, so we need to install a few tools such as ping, curl, and dig:

```
# apt update && apt install -y curl iputils-ping dnsutils
```

My app is named`xe-ollama`, so let’s look up its `.flycast` address with `nslookup xe-ollama.flycast`:

```
# nslookup xe-ollama.flycast
Server:		fdaa::3
Address:	fdaa::3#53

Name:	xe-ollama.flycast
Address: fdaa:3:9018:0:1::7
```

It matches that IP address from earlier. Now let’s see what happens when we ping it:

```
# ping xe-ollama.flycast -c2
PING xe-ollama.flycast (fdaa:3:9018:0:1::7) 56 data bytes
64 bytes from fdaa:3:9018:0:1::7: icmp_seq=1 ttl=63 time=0.138 ms
64 bytes from fdaa:3:9018:0:1::7: icmp_seq=2 ttl=63 time=0.223 ms

--- xe-ollama.flycast ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1009ms
rtt min/avg/max/mdev = 0.138/0.180/0.223/0.042 ms
```

Perfect, now let’s make a request to the Ollama app with curl:

```
# curl http://xe-ollama.flycast
```

It took a moment for Ollama to spin up, and now we get a happy “Ollama is running” message. Wait a few moments so your Ollama app goes to sleep and run the `time` command to see how long the first request takes:

```
# time curl http://xe-ollama.flycast
Ollama is running
real	0m9.144s
user	0m0.003s
sys		0m0.003s
```

It took a few seconds for the platform to wake up Ollama and make sure it was ready for your requests. The next request is a lot faster:

```
# time curl http://xe-ollama.flycast
Ollama is running
real	0m0.043s
user	0m0.003s
sys		0m0.003s
```

And if you wait a few moments, it’ll spin back down.

### Running Llama 3

Now that we’ve set up Ollama and demonstrated the platform turning it off and on for you, let’s run Llama 3. Exit out of that shell Machine with control-D so we can make a new one with the Ollama client installed.

Create an Ollama shell using `fly machine run`:

```
$ fly machine run --shell ollama/ollama
```

Once that starts up, point the Ollama client to your Flycast app by setting the `OLLAMA_HOST` environment variable:

```
# export OLLAMA_HOST=http://xe-ollama.flycast
```

Then you can ask Llama 3 anything you want:

```javascript
# ollama run llama3 "Why is the sky blue?"
```

It took a moment for Ollama to get ready and download the image, then it downloaded it and answered your question. Once it’s been idle for a moment, the platform will turn Ollama back off.

And there we go! We’ve covered what Flycast is, why you’d want to use it, and set up an instance of Ollama to show it off.

## Read more

We've talked about Flycast in some past blog posts and blueprints:

- [Autostart and autostop private apps](/docs/blueprints/autostart-internal-apps/)

- [Deploy Your Own (Not) Midjourney Bot on Fly GPUs](https://fly.io/blog/not-midjourney-bot/)

- [Scaling Large Language Models to zero with Ollama](https://fly.io/blog/scaling-llm-ollama/)
