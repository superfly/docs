---
title: Managing Docker Images with Fly.io's Private Registry
layout: docs
nav: guides
---

<figure>
  <img src="/static/images/using-the-fly-docker-reg.png" alt="Illustration by Annie Ruygt of Frankie the balloon and the Docker whale playing a game of bean bag toss" class="w-full max-w-lg mx-auto">
</figure>

Fly.io lets you deploy Docker containers as lightweight Firecracker VMs, running globally. While `fly launch` supports many frameworks and auto-generates deployment configurations, you can also build and push your own Docker images to Fly.io’s private registry and deploy them manually.

This guide walks through building, pushing, deploying, and managing images via Fly.io’s Docker registry.

## Tagging images for the Fly.io registry

Each Fly.io app gets a dedicated registry path in the form of:

```
registry.fly.io/<your-app-name>
```

To create a new app:

```sh
fly apps create <your-app-name>
```

App names must be globally unique. You can generate a unique one automatically:

```sh
fly apps create --generate-name
```

Then tag your image for the app's registry:

```sh
docker build -t registry.fly.io/<your-app-name>:<your-tag> .
```

## Authenticating and pushing to the registry

Authenticate Docker to use the Fly.io registry:

```sh
fly auth docker
```

This command updates your `~/.docker/config.json` with the required auth token for `registry.fly.io`. Once authenticated, push your image:

```sh
docker push registry.fly.io/<your-app-name>:<your-tag>
```

## Deploying the image

You can deploy images from the Fly.io registry or public registries, depending on where the image is hosted.

### To deploy a private image pushed to Fly.io's registry:

Use the `--image` option with the `fly deploy` command:

```sh
fly deploy --app <your-app-name> --image registry.fly.io/<your-app-name>:<your-tag>
```

### To deploy a public image from Docker Hub or another public registry:

Specify the image in your `fly.toml` file:

```toml
[build]
  image = "flyio/hellofly:latest"
```

## Reusing images across apps

Although registry URLs are structured per app, access is scoped per organization. This means you can push an image to `registry.fly.io/app-1` and use it in another app (e.g. `app-2`) if both apps are in the same Fly.io organization:

```sh
fly deploy --app app-2 --image registry.fly.io/app-1:tag
```

This pattern is useful for SaaS platforms that build once and deploy many times.

## Verifying image existence

You can verify that an image exists in the Fly registry without deploying it using Docker:

```sh
docker manifest inspect registry.fly.io/my-app-name:my-tag
```

This command returns data if the image exists, or exits with code 1 if it does not. It requires prior authentication using `fly auth docker`.

For most workflows, use the `fly deploy --image` option with the Fly Docker registry. For advanced flows like multi-app SaaS provisioning, track image tags using `docker manifest inspect` or associate them with Machines to retain them.

## Listing image tags

There is no API or GraphQL query to list all image tags in the registry. Tags only become visible to Fly when they are part of a release. You can view deployed image references with:

```sh
fly releases -a my-app-name --image
```

If you're using the GraphQL API to query releases, use the following query format:

```json
{
  "query": "query($appName: String!, $limit: Int!) { app(name: $appName) { releases: releasesUnprocessed(first: $limit) { nodes { id version description reason status imageRef stable user { id email name } createdAt } } } }",
  "variables": {
    "appName": "my-app-name",
    "limit": 25
  }
}
```

This will only return images used in past deploys.

## Related use case

Want to optimize your deploys with shared layers and pre-installed dependencies? See the [Using base images for faster deployments](https://fly.io/docs/blueprints/using-base-images-for-faster-deployments/#how-to-make-a-base-image+external) blueprint.
