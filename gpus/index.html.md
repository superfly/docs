---
title: Fly GPUs
layout: docs
nav: firecracker
---

Fly.io has GPUs! If you have workloads that would benefit from GPU acceleration, Fly GPU Machines may be for you.

<div class="important icon">
Fly GPUs are only available to vetted orgs right now. Sign up [here](https://fly.io/gpu)! If you leave a good explanation on the waitlist of who you are and what you want to build with GPUs, you'll hear from us pretty quickly.
</div>

## What can I use Fly GPUs for?

Fly GPUs are the NVIDIA A100 40G PCIe and A100 80G SXM. These units are positioned for inference, model training, and intensive high-precision computation tasks like scientific simulations. As their names suggest, they have 40GB and 80GB of GPU memory.

Right now each Fly GPU Machine uses a single full GPU. This is well suited to inference and maybe a smidgen of fine tuning. Training large models from scratch requires much beefier resources.

Fly GPUs can be used for rendering, but are not optimized for it the way desktop GPUs are. The A100 is heavy on the tensor cores and has [no RT cores for ray tracing, and no NVENC video encoder](https://images.nvidia.com/aem-dam/en-zz/Solutions/data-center/nvidia-ampere-architecture-whitepaper.pdf).

## How do I run a GPU Machine on Fly.io?

A Fly GPU Machine works very similarly to a CPU-only (AKA "normal") Fly Machine, and has access to the same platform features by default. It boots up with GPU drivers installed and you can run `nvidia-smi` right away. So to run a Fly App that uses CUDA compute is a slight variation on running any Fly App. In a nutshell:

1. Make sure GPUs are enabled on your Fly Organization.
1. Tell the Fly Platform to provision your Machines on Fly GPU hosts.
1. Provide a Docker image or Dockerfile for your project that includes the NVIDIA libraries your project uses, alongside the rest of your project .
1. Carry on as you would for any Fly App, tailoring it to the needs of your application.

<div class="note icon">
**Aside:** Firecracker doesn't do GPUs, so GPU-enabled Machines run under Cloud Hypervisor instead. This means you'll see some different output in logs, but in general you don't have to think about this.
</div>

See the [GPU Quickstart](https://fly.io/docs/gpus/gpu-quickstart/) to get off the ground fast, or read more practicalities in [Getting started with Fly GPUs](/docs/gpus/getting-started-gpus/).




## Examples

Here's some more inspiration for your GPU Machines project:

- [Python GPU Dev Machine](/docs/gpus/python-gpu-example/)
- [Elixir Llama2-13b on Fly.io GPUs](https://gist.github.com/chrismccord/59a5e81f144a4dfb4bf0a8c3f2673131)
- [Fly.io CUDA example](https://gist.github.com/dangra/f8123001fe0f2453a8cd638b89738465)
- [Deploying CLIP on Fly.io](https://gist.github.com/simonw/52c7734e34cac2b26ea1378845674edc)
- [Github `fly-apps` repos with the `gpu` topic](https://github.com/orgs/fly-apps/repositories?q=topic%3Agpu)