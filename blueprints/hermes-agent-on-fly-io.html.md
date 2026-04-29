---
title: Run Hermes Agent on Fly.io
layout: docs
nav: guides
date: 2026-04-28
---

[Hermes](https://github.com/NousResearch/hermes-agent) is an AI agent from Nous Research with a built-in learning loop: it watches its own output, notices when it had to improvise to finish a task, and writes that experience back as a reusable skill it can call next time. The skill library grows with use, so Hermes works best when it runs continuously on a persistent host rather than a short-lived sandbox, which is exactly what a Fly Machine with an attached volume gives you.

This guide walks you through running Hermes on a Fly Machine, configuring it, and reaching its web dashboard from your laptop.

You'll need **[flyctl](https://fly.io/docs/flyctl/install/)** installed, a **Fly.io account** ([free trial](https://fly.io/docs/about/free-trial/) works), and an **LLM API key** (Anthropic, OpenAI, Google Gemini, or [OpenRouter](https://openrouter.ai/) for access to 200+ models).

We'll use Nous Research's **official prebuilt image** (`nousresearch/hermes-agent:latest`) so there's no Dockerfile to maintain and no remote builder to wait on; Fly pulls the image straight from Docker Hub.

## Create the app and volume

Hermes keeps all its state; config, API keys, sessions, skills, memories in `/opt/data` inside the container. We'll back that with a Fly volume so it persists across deploys and restarts.

Pick an app name (must be globally unique on Fly) and a [region](https://fly.io/docs/reference/regions/) close to you, then:

```bash
fly apps create <your-hermes-app>
fly volumes create data --app <your-hermes-app> --region <region> --size 3
```

3 GB is comfortable headroom for sessions and the bundled skills directory.

## Write fly.toml

Create a directory for the deployment config and drop a `fly.toml` in it:

```toml
app = "<your-hermes-app>"
primary_region = "<region>"

[build]
  image = "nousresearch/hermes-agent:latest"

[experimental]
  cmd = ["gateway", "run"]

[[mounts]]
  source = "data"
  destination = "/opt/data"

[[vm]]
  memory = "4gb"
  cpus = 2
```

A few notes:

- **No `[build.dockerfile]`**, Fly pulls the image directly. Deploys take seconds, not minutes.
- **`[processes] app = "gateway run"`** defines the single process group for this app, and its command is passed to the image's entrypoint, so the Machine boots into `hermes gateway run` (the messaging gateway for Telegram, Discord, Slack, WhatsApp, etc.).
- **No `[[services]]` block.** The gateway talks *outbound* to chat platforms, so you don't need a public port. The dashboard exposes API keys and shouldn't be public; we'll reach it through a Fly proxy tunnel below.
- **4 GB / 2 CPU** is the recommended size when browser tools (Playwright/Chromium) are active. If you don't use browser tools you can drop to `shared-cpu-1x` and 1–2 GB.

## Deploy

```bash
fly deploy --app <your-hermes-app> --ha=false
```

`--ha=false` keeps it to a single machine; Hermes is stateful and you don't want two gateway processes writing to the same volume.

When the deploy finishes, the machine boots, the entrypoint bootstraps `/opt/data` (creating `.env`, `config.yaml`, `SOUL.md`, `sessions/`, `skills/`, etc.), and `hermes gateway run` starts. It'll keep running but it has no API key yet, so it can't talk to a model.

Confirm it's alive:

```bash
fly logs --app <your-hermes-app>
```

You should see the bundled skills sync, then the gateway starting up.

## Configure Hermes

SSH into the machine. The `hermes` binary lives at `/opt/hermes/.venv/bin/hermes` inside the image, but `fly ssh console` opens a login shell that resets PATH and won't find it there. Drop a symlink into `/usr/local/bin` (which is always on PATH) so `hermes` works as a bare command:

```bash
fly ssh console --app <your-hermes-app> -C \
  "ln -sf /opt/hermes/.venv/bin/hermes /usr/local/bin/hermes"
```

Then drop into the machine and run the setup wizard:

```bash
fly ssh console --app <your-hermes-app>
hermes setup
```

The wizard walks you through model selection, tool configuration, and connecting your messaging platforms. When it's done, exit the SSH session.

Restart the machine so the gateway picks up the new config:

```bash
fly machine restart <machine-id> --app <your-hermes-app>
```

Get `<machine-id>` from `fly machine list --app <your-hermes-app>`.

## Web dashboard

Hermes has a web dashboard on port 9119 for managing sessions, skills, and config. The dashboard reads your API keys, so the upstream guidance is to never expose it on a public port. Tunnel to it instead:

In one terminal, start the dashboard inside the machine:

```bash
fly ssh console --app <your-hermes-app> -C \
  "hermes dashboard --host 0.0.0.0 --no-open"
```

In a second terminal, open a Fly proxy from your laptop:

```bash
fly proxy 9119:9119 --app <your-hermes-app>
```

Now visit `http://localhost:9119` in your browser. Traffic goes over your authenticated WireGuard tunnel; the dashboard isn't published to the public internet, though it is reachable from other Machines on your organization's [private network](/docs/networking/private-networking/)

When you're done, `Ctrl+C` both commands. The gateway keeps running on the machine.

## Upgrading

The image is stateless; your data lives on the volume. To pull the latest Hermes:

```bash
fly deploy --app <your-hermes-app>
fly ssh console --app <your-hermes-app> -C \
  "ln -sf /opt/hermes/.venv/bin/hermes /usr/local/bin/hermes"
```

The deploy pulls `nousresearch/hermes-agent:latest` again. The second command re-creates the `/usr/local/bin/hermes` symlink; it lives on the container's filesystem, not the data volume, so each new container starts without it.

## VM sizing

If you're running heavy tool use or multiple concurrent sessions, scale up:

```bash
fly scale memory 8192 --app <your-hermes-app>
fly scale vm shared-cpu-4x --app <your-hermes-app>
```

## Useful commands

| Command | Description |
|---------|-------------|
| `fly logs --app <your-hermes-app>` | Stream live logs |
| `fly ssh console --app <your-hermes-app>` | SSH into the machine |
| `fly ssh console --app <your-hermes-app> -C "hermes doctor"` | Health check |
| `fly machine restart <id> --app <your-hermes-app>` | Restart after config changes |
| `fly status --app <your-hermes-app>` | Check machine status |
| `fly volumes list --app <your-hermes-app>` | List attached volumes |
| `fly ssh console --app <your-hermes-app> -C "hermes skills list"` | List learned skills |

## Troubleshooting

**Gateway won't start**, check `hermes doctor` for missing API keys or other diagnostics:

```bash
fly ssh console --app <your-hermes-app> -C "hermes doctor"
```

**Out of memory**

Increase RAM:

```bash
fly scale memory 8192 --app <your-hermes-app>
```

**Need to start fresh**

Wipe the config files (skills, sessions, and memories survive):

```bash
fly ssh console --app <your-hermes-app> -C \
  "sh -c 'rm -f /opt/data/config.yaml /opt/data/.env'"
fly machine restart <machine-id> --app <your-hermes-app>
fly ssh console --app <your-hermes-app>
hermes setup
```

To wipe everything including conversations, destroy and recreate the volume:

```bash
fly machine stop <machine-id> --app <your-hermes-app>
fly volumes destroy <volume-id> --app <your-hermes-app>
fly volumes create data --app <your-hermes-app> --region <region> --size 3
fly machine start <machine-id> --app <your-hermes-app>
```

**Skills behaving unexpectedly**

List, view, and delete:

```bash
fly ssh console --app <your-hermes-app>
hermes skills list
hermes skills view <skill-name>
hermes skills delete <skill-name>
```
