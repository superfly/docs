---
title: "Deploy MinIO Object Storage to Fly.io"
layout: docs
sitemap: false
nav: firecracker
categories:
  - s3
  - volumes
  - object storage
date: 2022-12-11
---

Object storage is useful when your apps need access to unstructured data like images, videos, or documents. Amazon's S3 is an obvious solution, but you can also host your own S3-compatible object storage using the AGPLv3-licensed [MinIO](https://min.io/).

We're going to set up a single instance of MinIO on Fly.io, backed by [Fly Volume storage](/docs/reference/volumes/).

A note: it's been observed that some features of the MinIO browser console are memory-intensive enough to crash a VM with 256MB of RAM. For even small-scale production use you'll probably need a larger (non-free) VM. 512MB seems to work for poking around and uploading small objects. (For perspective, [MinIO docs recommend a minimum of 128**GB** RAM](https://min.io/docs/minio/container/operations/checklists/hardware.html#minio-hardware-checklist) for deployment at scale.)

This is a guide to a demonstration deployment of the official standalone MinIO Docker image, and isn't tuned in any way. Check out the [MinIO](https://min.io/docs/minio/linux/index.html) [docs](https://github.com/minio/minio/tree/master/docs) for more sophisticated use.

## Dockerfile 

We'll use the official [minio/minio](https://hub.docker.com/r/minio/minio) Docker image, but with a custom start command. Here's the Dockerfile to build that: 

```docker
FROM minio/minio

CMD [ "server", "/data", "--console-address", ":9001"]
```

This just takes the MinIO image and runs it with the command `server /data --console-address :9001`, so that the server runs using the `/data` directory for storage. We'll get to that directory in a moment. The `--console-address` flag specifies which port to run the web-based admin console on. Otherwise, MinIO chooses a random port. See below for how to access this panel after MinIO has been deployed.

## Initializing the app

Initialize the app with `fly launch`. Here we use flags to specify an app name and the organization it belongs to. The most important flag is `--no-deploy`, because we still have Things to Do before we deploy:

```cmd
fly launch --name test-minio --org personal --no-deploy
```
```out
Creating app in /Users/chris/FlyTests/test-minio
Scanning source code
Detected a Dockerfile app
Selected App Name: test-minio
? Choose a region for deployment: London, United Kingdom (lhr)
Created app test-minio in organization personal
Wrote config file fly.toml
Your app is ready! Deploy with `flyctl deploy`
```

(Hold your horses. Your app is not, in fact, ready.)

## (Un)configure networking

There's no need for this app to be accessible from the public internet, if you run your object storage within the same [Fly IPV6 private network](https://fly.io/docs/reference/private-networking/) as the app(s) that want to connect to it.

Keep the `[[services]]` block in `fly.toml`, but delete everything within it:

```toml
[[services]]

```

Now the Fly proxy won't pass any requests to the app from outside your private network.

## Disk storage

The application's VM and image are ephemeral. When the app is stopped or moved it loses any data written to its file system. For persistent storage, provision a volume with a name and a size in the same region as the app.

```cmd
fly vol create miniodata --region lhr
```

```out
        ID: vol_w0enxv3nod1r8okp
      Name: miniodata
       App: test-minio
    Region: lhr
      Zone: 4de2
   Size GB: 3
 Encrypted: true
Created at: 05 Nov 22 16:13 UTC
```

We didn't specify a size, so we got the default: 3GB. 

Tell the app to mount this volume onto its `/data` directory, by appending to `fly.toml`:

```toml
[mounts]
source="miniodata"
destination="/data"
```

## Secrets

MinIO uses environment variables `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD` to store administrator login information. Instead of using normal environment variables, use `fly secrets set` to pass these sensitive values to the server in encrypted form. They'll only be decrypted at runtime.

```cmd
fly secrets set MINIO_ROOT_USER=<ROOT-USER> MINIO_ROOT_PASSWORD=<ROOT-PASS>
```

## Deployment

Now the app is, in fact, ready to deploy:

```cmd
fly deploy
```

## Accessing the web-based MinIO admin panel

MinIO has a web interface. It's served on the port specified by `--console-address` in the Dockerfile, which we set to `9001`. Fly restricts access to non-standard ports, so to access this panel we need to connect to our private WireGuard network.

One way to do this is to set up a [regular WireGuard tunnel](https://fly.io/docs/reference/private-networking/), and visit `http://test-minio.internal:9001` in the browser.

A simpler way is to use flyctl's user-mode WireGuard to proxy the port to our local machine:

```cmd
fly proxy 9001 
```
```out
Proxying local port 9001 to remote [test-minio.internal]:9001
```

Leave this running and visit `localhost:9001` with the browser.

Log into the admin panel with the `MINIO_ROOT_USER` and `MINIO_ROOT_PASSWORD` values set using Fly Secrets above, and you can create buckets, do administration, and upload and download files right from the browser.

## Using the `mc` MinIO Client

You can connect to your MinIO with the `mc` command-line [MinIO Client](https://min.io/docs/minio/linux/reference/minio-mc.html).

MinIO listens for non-browser connections on port 9000, by default. If you're connecting using `fly proxy`, you'll have to proxy port 9000 to use `mc`. 

You can set up an alias to connect more conveniently to your MinIO.

If you're using `fly proxy`:

```cmd
mc alias set proxy-to-minio http://localhost:9000 <ROOT-USER> <ROOT-PASS>
```

If you're hooked up with WireGuard:

```cmd
mc alias set miniotest http://test-minio.internal:9000 <ROOT-USER> <ROOT-PASS>
```

Test the alias by checking your MinIO's status:

```cmd
mc admin info miniotest
```

Create a new non-admin user with `readwrite` permissions. This user won't have full admin privileges, but will be able to create and save files to buckets.

```cmd
mc admin user add miniotest <NEW-USER> <NEW-USER-PASS>
```

At this point `<NEW-USER>` can log in and read the contents of your buckets. Make that read-write access:

```cmd
mc admin policy set miniotest readwrite user=<NEW-USER>
```

## What's next?

This was a basic guide for getting an instance of MinIO deployed on Fly.io, scratching the surface of what you might want to do with an S3-compatible object store. You can use your MinIO bucket storage right from the web interface. Your apps can talk to it from within the same private network. [MinIO docs](https://min.io/docs/minio/linux/index.html) cover more advanced usage. 
