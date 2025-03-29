---
title: Running Ollama on Fly GPUs
layout: docs
nav: firecracker
---

Self-hosting an LLM on Fly.io only takes a few steps. In this blueprint, we'll show you how to deploy an app with Ollama that uses Fly GPUs. This app is configured to scale to zero when not in use.

## Getting started

If you don't already have a Fly.io account, do that first (https://fly.io/app/sign-up), and make sure you have the Fly CLI installed (https://fly.io/docs/flyctl/install/).

First, clone [this repository](https://github.com/fly-apps/self-host-ollama), and feel free to change the `app` name in the `fly.toml`. Then launch it as a new Fly App with:

```cmd
fly launch --flycast
```

The `--flycast` flag will make your application private. To access your application, you'll use the address `http://<your-app>.flycast` and ensure you're connected over your WireGuard VPN. This will work in both production and local development. More on this later.

Now that your app is launched, let's download some Ollama models. First, SSH into one of your Fly Machines like so:

```cmd
fly ssh console
```

Next, set the value of your `OLLAMA_HOST`, so our `ollama` commands know what to use:

```cmd
export OLLAMA_HOST=<your-app>.flycast
```

Finally, pull down the model of your choice:

```cmd
ollama pull llava
```

And you're done! Your Ollama app is now available for use.

## Connecting to your app

This Ollama app will exist separate from whatever app you're building. Since our app is private (we don't random people eating up our Fly GPU usage), we'll need to connect to it over a secure WireGuard connection. When developing locally, the easiest method is to run:

```cmd
fly proxy 11434:80 -a <your-app>
# you don't need -a if you're in the Ollama app directory
```

This command proxies requests from a local port (`11434`) to port `80` on your Ollama Fly Machine, over a secure WireGuard tunnel.

When using Ollama in your app **locally**, you'll set the host to `http://localhost:11434`. Note that while `11434` is the standard port used by Ollama, since this is just a proxy, that number can really be anything.

In **production**, you'll use the host `http://<your-app>.flycast` instead.

## Examples

The following code would live in an app separate from your Ollama app; This allows you to auto-start and stop your Ollama app, so you're not paying for GPUs when not in use.

**JavaScript (npm `ollama` package)**

```typescript
import { Ollama } from "ollama";

const ollama = new Ollama({ 
  host: process.env.OLLAMA_APP_URL // either http://localhost:11434 or http://<your-app>.flycast on production
});

const response = await ollama.generate({
  model: 'llama3.1',
  prompt: "Give me a week's worth of healthy vegetarian meal ideas and their recipes.",
  stream: false,
})
```

**JavaScript (basic fetch request)**

```typescript
const params = {
  model: 'llama3.1',
  prompt: "Give me a week's worth of healthy vegetarian meal ideas and their recipes.",
  stream: false,
};

let resp = await fetch("http://sparkling-violet-709.flycast/api/generate", {
  method: "POST",
  body: JSON.stringify(params),
});
```

## Watch the video

Check out the accompanying video here: https://youtu.be/xkWcGmbhZRQ