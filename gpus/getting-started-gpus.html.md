---
title: Getting Started with Fly GPUs
layout: docs
nav: firecracker
---

## How do I run a GPU Machine on Fly.io?

A Fly GPU Machine works very similarly to a CPU-only (or "normal") Fly Machine, and has access to the same platform features by default. It boots up with GPU drivers installed and you can run `nvidia-smi` right away. So running a Fly App that uses CUDA compute is a slight variation on running any Fly App. In a nutshell:

1. Make sure GPUs are enabled on your Fly Organization.
1. Tell the Fly Platform to provision your Machines on Fly GPU hosts.
1. Provide a Docker image or Dockerfile for your project that installs the NVIDIA libraries your project uses, alongside the rest of your project.
1. Carry on as you would for any Fly App, tailoring it to the needs of your application.

<div class="note icon">
**Aside:** Firecracker doesn't do GPUs, so GPU-enabled Machines run under Cloud Hypervisor instead. This means you'll see some different output in logs, but in general you don't have to think about this.
</div>

## Placing your Machines on GPU hosts

Not all of Fly.io's physical servers have GPUs attached to them, so you have to tell the platform your requirements before the Machine is created on a host.

Configuration is done by different means depending on whether you're using Fly Launch to manage your app, or running Machines individually using the API or the [`fly machine run` command](/docs/machines/run/).

### Specify the GPU model

Assuming that you're going the [Fly Launch](/docs/launch/) way and configuring your Machines app-wide, you can include a line like the following in your `fly.toml` file before running `fly deploy` for the first time:

```
vm.size = "a100-40gb"
```

The `a100-40gb` preset is the `a100-pcie-40gb` GPU with the `performance-8x` CPU config and 32GB RAM. You can exert more granular control over resources using the [`[[vm]]` table](/docs/reference/configuration/#the-vm-section) in `fly.toml`.

Run `fly platform vm-sizes` to get the list of presets, and check out the [pricing page](/docs/about/pricing/#gpus-and-fly-machines) to help you plan ahead.

### Specify the region

But you're not done! For `fly deploy` to succeed in provisioning your Machine(s), the app's `primary_region` must match a region that hosts the kind of GPU you're asking for. At the time of writing, `a100-40gb` GPUs are only available in `ord`. Set the initial region in `fly.toml`:

```
primary_region = "ord"  # If you change this, ensure it's to a region that offers the GPU model you want
```

Currently GPUs are available in the following regions:

- `a10`: `ord`
- `l40s`: `ord`
- `a100-40gb`: `ord`
- `a100-80gb`: `iad`, `sjc`, `syd`


### Change GPU model

GPU models are located in different regions, so you'll likely have to destroy any existing Machines before redeploying using a different GPU spec.


## Choosing a Docker base image

Many open-source ML projects have ready-made Docker images; for example: [Ollama](https://ollama.ai/blog/ollama-is-now-available-as-an-official-docker-image+external), [Basaran](https://github.com/hyperonym/basaran+external), [LocalAI](https://localai.io/basics/getting_started/+external). Check out [GitHub `fly-apps` repos with the `gpu` topic](https://github.com/orgs/fly-apps/repositories?q=topic%3Agpu+external) for some examples.

If you're building your own image, choose a base image that [NVIDIA supports](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html#system-requirements+external); `ubuntu:22.04` is a solid choice that's compatible with the CUDA driver GPU Machines use. You can launch a vanilla Ubuntu image and run `nvidia-smi` with no further setup.

From there, install whatever packages your project needs. This will include some libraries from NVIDIA if you want to do something more than admire the output of `nvidia-smi`.

## Installing NVIDIA libraries

You don't need to install any `cuda-drivers` packages in the Docker image, but you'll want some subset of [NVIDIA's GPU-accelerated libraries](https://developer.nvidia.com/gpu-accelerated-libraries+external). `libcublas-12-2` (linear algebra) and `libcudnn8` (deep-learning primitives) are a common combination, along with [`cuda-nvcc`](https://developer.nvidia.com/cuda-llvm-compiler+external) for compiling stuff with CUDA support.

In general, you'll install NVIDIA libs using your Linux package manager. In a Python environment, it's possible to skip system-wide installation and use pip packages instead.

Tips:

-  Be deliberate about how much cruft you put in your Docker image. Avoid meta-packages like `cuda-runtime-*`.
- `cuda-libraries-12-2` is a convenient, but bulky, start. Once you know what libs are needed at build and runtime, pick accordingly to optimize final image size.
- Use multi-stage docker builds as much as possible.

To install packages from NVIDIA repos, you'll need the `ca-certificates` and `cuda-keyring` packages first.

## Where to store data

Machine learning tends to involve large quantities of data. We're working with a few constraints:

- Large Docker images (many gigabytes) can be very unwieldy to push and pull, particularly over large geographical distances.
- The root file system of a Fly Machine is ephemeral -- it's reset from its Docker image on every restart. It's also limited to 50GB on GPU-enabled Machines.
- Fly Volumes are limited to 500GB, and are attached to a physical server. The Machine must run on the same hardware as the volume it mounts.

Unless you've got a constant workload, you'll likely want to shut down GPU Machines when they're not needed&mdash;you can do this manually with `fly machine stop`, [have the main process exit](/docs/launch/autostop-autostart/#apps-that-shut-down-when-idle) when idle, or use the Fly Proxy [autostop and autostart](/docs/launch/autostop-autostart/) features&mdash;to save money. Saving data on a persistent Fly Volume means you don't have to download large amounts of data, or reconstitute a large Docker image into a rootfs, whenever the Machine restarts. You'll probably want to store models, at least, on a volume.

## Using swap

Designing your workload and provisioning appropriate resources for it are the first line of defense against losing work by running out of memory (system RAM or VRAM). 

You can also enable swap for system RAM on a Fly Machine, simply by including a line like the following in `fly.toml`:

```
swap_size_mb = 8192    # This enables 8GB swap
```

Keep in mind that this consumes the commensurate amount of space on the Machine's root file system, leaving less capacity for whatever else you want to store there.

If you need more system RAM and faster performance, also scale up with `fly scale memory`.
