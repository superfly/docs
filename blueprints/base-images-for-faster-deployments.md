---
title: Using base images for faster deployments
layout: docs
nav: firecracker
---

This blueprint is going to explain how to use base images for faster deployments.  A base image is any image that is intended to be used as the `FROM` line in a Dockerfile.  Each app that is deployed on Fly.io can add an image to the Fly registry.

Every app in the same organization can access the image for any other app and use it as the `FROM` line in their Dockerfile.  This means that it is very easy to make a base image by making a second app to use as the base image.

## Why use a base image?

Most developers have a specific reason for using a base image in their project.  Usually it's one of the following:

* The base image can be built with all of their app's dependencies.  Rebuilding the app on top of this base image means the deploy process is only running the app-specific build processes, not the entire dependency tree.
* The same app is deployed for a number of different end users.  Each end user has some specific files or configurations to build into the image.  A base image can get *most of the way* to the final configuration, and their app can do the final steps.


## How to make a base image?

Let's build an example application and deploy it!  We'll start with making an application called `go-fly-a-site` that runs a Go program as a webserver.  Once we have made the application, we'll make a base image from it with the parts that aren't specific to our application.  Once that's done, we'll make update our application to use the base image.

### Making the app

Our program will be very simple.  It will respond to HTTP requests on port 8080 and respond with "Hello World!".

```GO
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", HelloServer)
    http.ListenAndServe(":8080", nil)
}

func HelloServer(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, "Hello, world!\r\n")
}

```

Now we'll make a Dockerfile.  We're going to base the Dockerfile on `debian:12`, install `curl` and `go`, compile our Go code, and set it to run.

```Dockerfile
FROM debian:12

# Install Go
RUN apt-get update; apt-get upgrade; apt-get -y install golang

# Copy the code for our server to /opt/main.go
COPY main.go /opt/main.go

# Build /opt/server from the code in /opt/main.go
RUN go build -o /opt/server /opt/main.go

# Run our code from main.go as /opt/server
CMD [ "/opt/server" ]
```

Now we have the go code, `main.go` in this directory, and we have this `Dockerfile` as well.  We'll deploy the application:

```bash
$ fly launch --name go-fly-a-site --vm-size shared-cpu-1x --no-deploy
....
Your app is ready! Deploy with `flyctl deploy`
```

Now we have an additional file, `fly.toml` and have created the app `go-fly-a-site`.

We'll deploy the app:

```bash
$ fly deploy
==> Verifying app config
Validating /Users/fly/Code/go-fly-a-site/fly.toml
✓ Configuration is valid
--> Verified app config
==> Building image
==> Building image with Depot
--> build:
...

Visit your newly deployed app at https://go-fly-a-site.fly.dev/

```

We can see it's running:

```bash
$ curl https://go-fly-a-site.fly.dev/
Hello, world!
```

Now our app is built and running.  This is great, but each time we `fly deploy` we might be reinstalling golang through apt.  We probably want to do that much less often than we want to update our `main.go`, so we can make a base image that installs go for us.

### Make a base image

Let's make a new file called `base.Dockerfile`.  For this file, we will keep the Go install.  We will replace the previous `CMD` statement with `[ "sleep", "inf" ]` so that we can easily SSH into this image to inspect it if needed in the future.


```Dockerfile
FROM debian:12

# Install Go
RUN apt-get update; apt-get upgrade; apt-get -y install golang

CMD [ "sleep", "inf" ]
```

We'll copy the `fly.toml` and make some modifications.  We will call this copy `fly-base.toml`.  We will append `-base` on the app name, explictly include `dockerfile` in the `[build]` section, and remove the `[http_service]` section.  We now have a file that looks like this:

```toml
app = 'go-fly-a-site-base'
primary_region = 'lax'

[build]
    dockerfile = "base.Dockerfile"

[[vm]]
  size = 'shared-cpu-1x'
```

Next, we'll make the app!  The `--ha=false` makes sure we're only using one Machine, and the `--config base.fly.toml` makes sure we're using the correct config file.  We must say `yes` when asked about the existing `fly.toml` file, and we don't want to tweak the settings.

```bash
$ fly launch --ha=false --config base.fly.toml
An existing fly.toml file was found for app go-fly-a-site-base
? Would you like to copy its configuration to the new app? Yes
Using build strategies '[the "base.Dockerfile" dockerfile]'. Remove [build] from fly.toml to force a rescan
Creating app in /Users/fly/Code/go-fly-a-site
We're about to launch your app on Fly.io. Here's what you're getting:

...
Region:       Los Angeles, California (US) (from your fly.toml)
App Machines: shared-cpu-1x, 256MB RAM     (from your fly.toml)
...

? Do you want to tweak these settings before proceeding? (y/N)
Created app 'go-fly-a-site-base' in organization 'personal'
Admin URL: https://fly.io/apps/go-fly-a-site-base
Hostname: go-fly-a-site-base.fly.dev
Wrote config file base.fly.toml
...
--> build:
--> Building image done
image: registry.fly.io/go-fly-a-site-base:deployment-01JTKF7JXJ1ZGMA76GCJ5WGZQZ
image size: 233 MB
```

Some things to note:

* We have the base image name we can use, it's the URL provided in `image:`.
* When we go to the admin URL, we can click **Registry** and see the same image URL.
* The **Registry** will have the list of images that have been created.
* Any app in your organization can use the image URL for a `FROM` statement in a Dockerfile.
* Apps in any other organization will get an error if they try to use this image.


### Updating the app to use the base image

Now that we have this base image done, let's update the Dockerfile for go-fly-a-site:


```Dockerfile
FROM registry.fly.io/go-fly-a-site-base:deployment-01JTKF7JXJ1ZGMA76GCJ5WGZQZ

# Copy the code for our server to /opt/main.go
COPY main.go /opt/main.go

# Build /opt/server from the code in /opt/main.go
RUN go build -o /opt/server /opt/main.go

# Run our code from main.go as /opt/server
CMD [ "/opt/server" ]
```

With the updated Dockerfile in place, we'll deploy with `fly deploy`

```bash
$ fly deploy
==> Verifying app config
Validating /Users/fly/Code/go-fly-a-site/fly.toml
✓ Configuration is valid
--> Verified app config
==> Building image
==> Building image with Depot
--> build:
[+] Building 20.7s (8/8) FINISHED
 ...
 => [internal] load metadata for registry.fly.io go-fly-a-site-base:deployment-01JTKF7JXJ1ZGMA76GCJ5WGZQZ
 ...
 ```

 We can see that it used the new base image, and the application is running:

```bash
$ curl https://go-fly-a-site.fly.dev/
Hello, world!
```

We can shutdown the one Machine for the base image:

```
$ fly machine list --config base.fly.toml
1 machines have been retrieved from app go-fly-a-site-base.
View them in the UI here

go-fly-a-site-base
ID            	NAME               	...
d890175f6940e8	wandering-wave-6179	...
````

Grab the Machine ID and then run `fly machine stop` with the app and Machine id:

```bash
$ fly machine stop d890175f6940e8 --config base.fly.toml
Sending kill signal to machine d890175f6940e8...
d890175f6940e8 has been successfully stopped
```

We won't be charged for the CPU and Memory usage for that small Machine, we'll only encounter rootfs charged for the image that's being stored.

Now we have a base image for our project!  We can modify and deploy our `main.go` code without having to reinstall Go.  If we ever need to add additional dependencies to the base image, we just modify the `base.Dockerfile`, deploy it again, and get the new `image:` from the deploy command or in the **Registry** section of the app's dashboard.

## Command Reference

Get Machines for the base image: `fly machine list --config base.fly.toml`

Start Machine for the base image: `fly machine start <ID_FROM_LIST>  --config base.fly.toml`

Stop Machine for the base image: `fly machine stop <ID_FROM_LIST>  --config base.fly.toml`

Get SSH access to the base image: `fly ssh console --config base.fly.toml` (Make sure the Machine is started)

Rebuild the base image: `fly deploy --config base.fly.toml` (Update `base.Dockerfile` with your changes first, and remember to stop the Machine when you're done)

## Additional Notes

If you have a base image that many different apps will use, it can make sense to keep it all in its own app directory.  You can use `fly.toml` and `Dockerfile` like a normal app.

The base image will stick around in the registry and as long as an image is associated with a Machine -- even if the Machine is stopped -- it won't be deleted.

You can find the registry URL of the images for your base image in the dashboard under the **Registry** tab for the app, or by running `fly releases --image`

