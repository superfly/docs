---
title: Using base images for faster deployments
layout: docs
nav: guides
---

This blueprint explains how to use base images for faster deployments.  A base image is any image that is intended to be used as the `FROM` line in a Dockerfile.  Each app that is deployed on Fly.io can add an image to the Fly registry.

Every app in the same organization can access the image for any other app and use it as the `FROM` line in their Dockerfile.  This means that it is very easy to make a base image by making a second app to use as the base image.

## Why use a base image?

Most developers have a specific reason for using a base image in their project.  Usually it's one of the following:

* The base image can be built with all of their app's dependencies.  Rebuilding the app on top of this base image means the deploy process is only running the app-specific build processes, not the entire dependency tree.
* The same app is deployed for a number of different end users.  Each end user has some specific files or configurations to build into the image.  A base image can get *most of the way* to the final configuration, and their app can do the final steps.


## How to make a base image

This guide walks through building and deploying an example application called go-fly-a-site, which runs a simple Go web server.  After deploying the app, you'll create a base image from its non-app-specific parts.  Finally, you'll update the app to use that base image.

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

Create a Dockerfile based on Debian 12.  Install curl and go, compile the Go code, and configure the image to run the compiled binary.

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

With `main.go` and the `Dockerfile` in your project directory, deploy the application:

```bash
$ fly launch --name go-fly-a-site --vm-size shared-cpu-1x --no-deploy
....
Your app is ready! Deploy with `flyctl deploy`
```

Now we have an additional file, `fly.toml` and have created the app `go-fly-a-site`.

Deploy the app:

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

Now our app is built and running.  This is great, but each time we `fly deploy` we might be reinstalling Go through apt.  We probably want to do that much less often than we want to update our `main.go`, so we can make a base image that installs go for us.

### Make a base image

Let's make a new file called `base.Dockerfile`.  For this file, we will keep the Go install.  We will replace the previous `CMD` statement with `[ "sleep", "inf" ]` so that we can easily SSH into this image to inspect it if needed in the future.


```Dockerfile
FROM debian:12

# Install Go
RUN apt-get update; apt-get upgrade; apt-get -y install golang

CMD [ "sleep", "inf" ]
```
Copy `fly.toml` to `fly-base.toml` and make the following modification:

* Append -base to the app name.
* Explicitly include dockerfile in the `[build]` section.
* Remove the `[http_service]` section.

The resulting file looks like this:

```toml
app = 'go-fly-a-site-base'
primary_region = 'lax'

[build]
    dockerfile = "base.Dockerfile"

[[vm]]
  size = 'shared-cpu-1x'
```

Create the app using the following options:

* `--ha=false` ensures the app uses a single Machine.
* `--config base.fly.toml` specifies the correct config file.

When prompted about the existing `fly.toml` file, select yes to copy its configuration. You can skip tweaking the settings.

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

After creating the base image, update the Dockerfile for go-fly-a-site:


```Dockerfile
FROM registry.fly.io/go-fly-a-site-base:deployment-01JTKF7JXJ1ZGMA76GCJ5WGZQZ

# Copy the code for our server to /opt/main.go
COPY main.go /opt/main.go

# Build /opt/server from the code in /opt/main.go
RUN go build -o /opt/server /opt/main.go

# Run our code from main.go as /opt/server
CMD [ "/opt/server" ]
```

With the updated Dockerfile in place, deploy the app with `fly deploy`.

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

You’ll only be charged for the root file system storage of the image that's being stored.

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

## Related use case

Want to skip the Fly builder and use Docker tools directly to manage your images?  See [Managing Docker Images with Fly.io's Private Registry](https://fly.io/docs/blueprints/using-the-fly-docker-registry/), a guide that walks through building, pushing, deploying, and managing images via Fly.io’s Docker registry!

