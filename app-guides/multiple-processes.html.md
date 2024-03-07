---
title: "Running Multiple Processes Inside A Fly.io App"
layout: docs
sitemap: true
toc: true
nav: firecracker
author: thomas
categories:
  - guide
date: 2020-07-20
---

This comes up a lot: how can you run multiple programs in an app on Fly.io? Recall that Fly.io apps are shipped to us in containers, usually built by Docker, and Docker has… opinions… about running multiple things in a container.

Well, [we don't use Docker to run containers](https://fly.io/blog/docker-without-docker/). Your app is running in a VM, with its own kernel. You can do pretty much anything you want inside of it, including running as many programs as you like. Most of the time, the trick is just telling Docker how to do that.

There are a couple different ways to run multiple processes in a Fly.io app. All of them address the first rule of programs running in Fly VM: when your entrypoint program exits, our `init` kills the VM and we start a new one. So at the end of the day, *something* has to keep running "in the foreground".

For more information about process groups, refer to [Run multiple process groups in an app](/docs/apps/processes/).

<div class="callout">Fly.io <u>[Machines](/docs/machines)</u> can run multiple processes</u> natively, no need for extra configuration. <u>[Examples here](https://community.fly.io/t/multi-process-machines/8375)</u>.</div>

### Setting the scene

Let's use the world's dumbest Golang app as our test case. Here's a Dockerfile:

```Dockerfile
FROM golang

RUN apt-get update && \
    apt-get install -y \
        bash \
        curl

RUN mkdir /app
WORKDIR /app
ADD go.* *.go /app/
RUN go build

CMD tail -f /dev/null
```

I'll spare you the 10 lines of Go code, but it's just a server that runs "Hello Foo" on 8080/tcp if you run it without arguments, and "Hello Bar" on 8081/tcp if you run it `-bar`. Use your imagination!

And we're not running anything right now; it's just going to sit there inert while we figure out how to run both instances of the program. 

With a working Dockerfile, we can spin this up with `fly launch`. We'll edit `fly.toml` to tell Fly.io about the two internal ports we're listening on, and `fly deploy` to effect that change.

Now, some options to actually run this stuff:

### Process groups

This is the recommended way to run multiple processes. **This method runs each process in its own VM**. Examples of running multiple processes within a single VM are found below!

Fly.io has the notion of [process groups](https://community.fly.io/t/preview-multi-process-apps-get-your-workers-here/2316). You can define multiple processes in your `fly.toml`, giving each a name. Each defined process runs in its own VM within the one app.

You can see that in action in the below (truncated) `fly.toml` file:

```toml
[processes]
web = "/app/server"
bar_web = "/app/server -bar"

[[services]]
  processes = ["web"] # this service only applies to the web process
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  script_checks = []
```

Here we define two processes: `web` and `bar_web`. Each command (e.g. `/app/server` and `/app/server -bar`) is setting the *command* passed to your Dockerfile *entrypoint*. That means your entrypoint needs to be able to handle a command being passed to it!

Here's an example of such an entrypoint:

```bash
#!/bin/bash

if [[ $# -gt 0 ]]; then
    # If we pass a command, run it
    exec "$@"
else
    # Else default to starting the server
    exec /app/server
fi
```

Note that under the `[[services]]` section of the `fly.toml` file, we define a service for process `web`. The `processes = [...]` array acts as a filter - it will apply only to the processes listed.

See the [announcement post](https://community.fly.io/t/preview-multi-process-apps-get-your-workers-here/2316) for more details on scaling with multiple processes. Also note that it's a bit finnicky - it's best to create *new* apps with multiple processes. Adding them on top of existing apps (or removing them from apps that are using them) may cause some confusion. We're working on it!

### Just use Bash

This is gross, but a suggestion Docker makes in its own documentation, so it must be OK. We boot our Docker container into a shell script. That shell script is:

```bash
#!/bin/bash

set -m # to make job control work
/app/server &
/app/server -bar &
fg %1 # gross!
```

The trick here is we can run any number of programs in the background, as long as we foreground one of them at the end of the script, so the script itself doesn't exit (and tell us to kill the VM). 

Call this `gross.sh` and change the Dockerfile entrypoint:

```dockerfile
ADD gross.sh /app/
CMD /app/gross.sh
```

This works well enough to connect the app to Fly.io's Anycast network, so here's where we'd crack open `fly.toml`:

```toml
[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = "80"

  [[services.ports]]
    handlers = ["tls", "http"]
    port = "443"
```

(It's a contrived example, so I'm only lighting one of the ports up, but whatever). 

### Use Supervisord

The other Docker documentation suggestion: use `supervisor`. `supervisor` is an actual process manager; it'll run in the foreground and manage all our processes and, most importantly, when our processes exit, `supervisor` will (configurably) restart it. 

`supervisor` has [a lot of configuration options](http://supervisord.org/configuration.html+external). But because we're running on Fly.io, we mostly don't care about them; the platform is doing a lot of this work for us. So the `supervisor` configuration we want is pretty simple:

```toml
[supervisord]
logfile=/dev/stdout 
logfile_maxbytes=0  
loglevel=info
pidfile=/tmp/supervisord.pid
nodaemon=true
user=root

[unix_http_server]
file=/tmp/supervisor.sock

[program:foo]
command=/app/server

[program:bar]
command=/app/server -bar
``` 

If you're running an app on Fly.io, chances are you don't want it composting its own logs in `/var/log`, so we just configure `supervisor` to log to `stdout` like a normal person. The rest, apart from our command lines, is just boilerplate.

(You could drop privileges by changing the `user` line if you wanted; whether you want to depends on whether there's meaningful security to get by running multi-user in your particular container. If basically everything in the container shares the same data, there probably isn't.)

Our Dockerfile derives from the  `golang` base image, and to add `supervisor` to it, we just need to add the dep:

```Dockerfile
FROM golang

RUN apt-get update && \
    apt-get install -y \
        bash \
        supervisor \
        curl
# ...

ADD supervisor.conf /app/
CMD supervisord -c /app/supervisor.conf
```

### Use a Procfile Manager 

`supervisor` works, and lots of people use it. It's a bit fussy, though, and it pulls Python in as a dependency. There are lots of other process managers. One useful genus of them are the `Procfile` managers. `Procfiles` are so dirt simple you don't need me to explain them; just look:

```
foo: /app/server 
bar: /app/server -bar
```

A Procfile manager I like a lot is [overmind](https://github.com/DarthSim/overmind+external). `overmind` is a Go program, so it's got a small runtime, and you could, if you were fussy, build a container that just takes the `overmind` binary and none of its build deps. We won't bother, though, since we're already bringing those deps in. So:

```Dockerfile
FROM golang

RUN apt-get update && \
    apt-get install -y \
        bash \
        tmux \
        curl
# ...

RUN GO111MODULE=on go get -u github.com/DarthSim/overmind/v2
ADD Procfile /app/
CMD ["overmind", "start"]
```

`overmind` has a bunch of interesting features, most notable among them that it wraps `tmux`, so you can get a terminal window on any of your running programs. Deploy, and then you can:

```bash
$ flyctl ssh console 
root@30952b25:/# cd /app
root@30952b25:/# overmind connect foo
# (clouds part, screen fills with foo's terminal)
```

If you're not a `tmux` person, `ctr-b d` detaches you from that window.

### There are so many other process managers

Use whichever you like! The only limitation you're going to run into is that Fly.io owns your `init` (sorry!); we have to be PID 1. There are a bunch of process managers that want to replace `init`, and those'll be tricky to get to work in a Fly.io app. 

### Maybe you want multiple apps, though

There are good reasons to run multiple programs in a single container, but sometimes when you're doing that you're actually working against the platform (which is why Docker keeps telling you not to do that). 

If you're running multiple heavy-weight things in a single container, you might explore just running them as separate Fly.io apps. The advantage to doing this, apart from the apps not fighting over the same CPUs and memory, is that you can scale separate apps independently, and put them in different sets of regions.

Fly.io apps can talk to each other over a [private network](https://fly.io/docs/networking/private-networking/) that's always available. They can find each other under the `.internal` top-level domain (if your apps are `foo` and `bar`, they'll be in the DNS as `foo.internal` and `bar.internal`). Because the network connection is private and encrypted, you can generally just talk back and forth without extra authentication until you know you need it; in other words, you can keep things simple.

### Maybe you don't need multiple processes

There are a bunch of reasons people want to run multiple things in a container that Fly.io already takes care of for you. For instance: [metrics are a built-in feature of the platform](https://fly.io/blog/hooking-up-fly-metrics/), as are logs. You might not need to run helper processes for this kind of stuff.

Another thing people run multiple programs to get is static asset HTTP service; you'll run your app server, and a small webserver alongside it to serve assets. You don't need to do this if you don't want! Instead, you can ask the Fly.io platform to do it for you, by adding `statics` directives to your `fly.toml`:

```toml
[[statics]]
  guest_path = "/app/public"
  url_prefix = "/public"
```

When Fly.io sees that in your `fly.toml`, it'll fish your static assets out of your container and serve them directly from our proxies at the `url_prefix` you specify. This is faster and, of course, doesn't demand you package an HTTP server into your container. 

