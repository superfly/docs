---
title: Deploy OpenClaw on Fly.io
layout: docs
nav: guides
date: 2026-03-25
---

To deploy [OpenClaw](https://github.com/openclaw/openclaw) to Fly.io, download the deploy package and run the script. It handles everything — app creation, volumes, secrets, and deployment.

<a href="https://github.com/superfly/Openclaw-Fly-Deploy/archive/refs/heads/main.zip" class="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition-colors no-underline" download>Download Deploy Package</a>

```bash
unzip Openclaw-Fly-Deploy-main.zip
cd Openclaw-Fly-Deploy-main
bash deploy.sh
```

You'll need **[flyctl](https://fly.io/docs/flyctl/install/)** installed, a **Fly.io account** ([free trial](https://fly.io/docs/about/free-trial/) works), and an **LLM API key** (Anthropic, OpenAI, Google Gemini, OpenRouter, Moonshot AI, or MiniMax).

## What is OpenClaw?

OpenClaw is an open-source AI agent gateway that lets you run a persistent AI assistant reachable from anywhere — Discord, Telegram, Slack, or your local CLI. It manages conversations, tool use, and connections across multiple channels through a single gateway process.

## How it works

The deploy package sets up a wrapper server that manages the OpenClaw gateway and provides a browser-based setup wizard:

```
Internet → Fly.io proxy → Wrapper server (:3000) → OpenClaw gateway (:18789)
                              ├── /setup      → Setup wizard (password-protected)
                              ├── /healthz    → Health check (no auth)
                              └── /*          → Proxied to gateway
```

All state lives on a persistent volume mounted at `/data`, so your configuration, conversation history, and installed tools survive restarts and redeployments.

The script will prompt you for:

1. **App name** — defaults to `openclaw-XXXX` (random suffix). This becomes your URL: `https://your-app-name.fly.dev`
2. **Region** — where to run your Machine (defaults to `iad` / Virginia). Pick one close to you for lower latency. See [Fly.io regions](/docs/reference/regions/) for the full list.
3. **Setup password** — protects the `/setup` wizard from the internet. Pick something strong.
4. **LLM provider** — choose from Anthropic, OpenAI, Google Gemini, OpenRouter, Moonshot AI, or MiniMax
5. **LLM API key** — the key for your chosen provider
6. **Channel tokens** (optional) — Discord bot token, Telegram bot token, or Slack bot + app tokens if you want to connect chat channels

The script then creates a Fly app, provisions a persistent volume, sets your credentials as encrypted [Fly secrets](/docs/apps/secrets/), and builds and deploys the Docker image on Fly's remote builders. The first deploy takes a few minutes. Your credentials never leave your machine — they go directly to Fly.io via `flyctl`.

## Post-deploy setup

Once deployment completes, the script prints your app details:

```
=== Deployment Complete ===

  App URL:       https://your-app-name.fly.dev
  Setup wizard:  https://your-app-name.fly.dev/setup
  Gateway URL:   wss://your-app-name.fly.dev
  Gateway token: <your-generated-token>
```

### Setup wizard

Visit `https://your-app-name.fly.dev/setup` in your browser. Log in with any username and the setup password you chose. From the wizard you can:

- Change your LLM provider and API key
- Add or update Discord, Telegram, and Slack channel connections
- Edit the raw OpenClaw config file
- Run debug commands against the gateway
- Export and import configuration backups
- Approve device pairing requests

### Connect your local CLI

If you have OpenClaw installed locally, point it at your remote gateway:

```bash
openclaw config set gateway.mode remote
openclaw config set gateway.remote.url wss://your-app-name.fly.dev
openclaw config set gateway.remote.token <your-gateway-token>
openclaw health  # verify the connection
```

This lets you use the `openclaw` CLI on your laptop while the gateway runs on Fly.io, keeping conversations and state persistent even when your laptop is closed.

## Configuration

### Secrets

All sensitive values are stored as [Fly secrets](/docs/apps/secrets/), encrypted at rest and injected as environment variables at boot. They are never visible in logs, config files, or the Fly dashboard.

| Secret | Required | Description |
|--------|----------|-------------|
| `SETUP_PASSWORD` | Yes | Protects the `/setup` wizard with HTTP Basic Auth |
| `OPENCLAW_GATEWAY_TOKEN` | Yes | Auth token for gateway connections (auto-generated) |
| `OPENCLAW_API_KEY` | Yes | Your LLM provider API key |
| `OPENCLAW_AUTH_CHOICE` | Yes | Provider identifier (set by deploy script) |
| `OPENCLAW_API_KEY_FLAG` | Yes | CLI flag for the provider (set by deploy script) |
| `OPENCLAW_DISCORD_TOKEN` | No | Discord bot token |
| `OPENCLAW_TELEGRAM_TOKEN` | No | Telegram bot token |
| `OPENCLAW_SLACK_BOT_TOKEN` | No | Slack bot token (`xoxb-...`) |
| `OPENCLAW_SLACK_APP_TOKEN` | No | Slack app token (`xapp-...`, required if bot token is set) |

To update a secret after deployment:

```bash
fly secrets set OPENCLAW_API_KEY=sk-new-key-here -a your-app-name
```

The Machine restarts automatically when secrets change.

### VM sizing

The default configuration uses a `shared-cpu-2x` Machine with 4 GB RAM, which costs roughly $20–25/month when running continuously. With auto-stop enabled (the default), you only pay for time the Machine is actually running.

To adjust resources:

```bash
fly scale memory 4096 -a your-app-name
fly scale vm shared-cpu-4x -a your-app-name
```

### Persistent storage

OpenClaw stores all state on a [Fly Volume](/docs/volumes/overview/) mounted at `/data`. This includes:

- `openclaw.json` — gateway configuration
- Conversation history and context
- Installed tools and plugins
- npm/pnpm caches for user-installed packages

The default volume size is 1 GB. To extend it:

```bash
fly volumes extend <volume-id> -s 3 -a your-app-name
```

## Useful commands

| Command | Description |
|---------|-------------|
| `fly logs -a your-app-name` | Stream live logs |
| `fly ssh console -a your-app-name` | SSH into the Machine |
| `fly apps restart your-app-name` | Restart after config changes |
| `fly scale memory 4096 -a your-app-name` | Increase memory |
| `fly status -a your-app-name` | Check Machine status |
| `fly volumes list -a your-app-name` | List attached volumes |

## Troubleshooting

**"SETUP_PASSWORD is not set"**
The setup password secret is missing. Set it:
```bash
fly secrets set SETUP_PASSWORD=your-password -a your-app-name
```

**Out of memory / crashes**
Increase the Machine's memory:
```bash
fly scale memory 4096 -a your-app-name
```

**Gateway won't start**
Visit `/setup` in your browser and check the debug console for errors. Common causes: invalid API key, missing config file, or a corrupted state directory.

**Lock file errors**
If the gateway didn't shut down cleanly, stale lock files can prevent it from starting:
```bash
fly ssh console -a your-app-name
rm -f /data/gateway.*.lock
exit
fly apps restart your-app-name
```

**Need to start fresh**
Use the "Reset" button in the setup wizard to clear the config and re-run onboarding, or SSH in and remove the config:
```bash
fly ssh console -a your-app-name
rm /data/openclaw.json
exit
fly apps restart your-app-name
```

## Supported LLM providers

| Provider | What you need |
|----------|---------------|
| Anthropic | API key from [console.anthropic.com](https://console.anthropic.com/) |
| OpenAI | API key from [platform.openai.com](https://platform.openai.com/) |
| Google Gemini | API key from [aistudio.google.com](https://aistudio.google.com/) |
| OpenRouter | API key from [openrouter.ai](https://openrouter.ai/) |
| Moonshot AI | API key from Moonshot's developer portal |
| MiniMax | API key from MiniMax's developer portal |

You can switch providers at any time through the setup wizard — no redeployment needed.
