---
title: Fly GPUs
layout: docs
nav: firecracker
toc: false
---

Fly.io has GPUs! If you have workloads that would benefit from GPU acceleration, Fly GPU Machines may be for you.

<figure class="flex justify-center">
  <img src="/static/images/bullet.png" alt="Illustration by Annie Ruygt of Frankie the hot air balloon admiring a fast-pacing motor bike" class="max-w-lg">
</figure>

## What can I use Fly GPUs for?

Four models of GPU are available: A10, L40S, NVIDIA A100 40G PCIe and A100 80G SXM.

A100 units are all about the tensor cores, and are positioned for inference, model training, and intensive high-precision computation tasks like scientific simulations. As their names suggest, they have 40GB and 80GB of GPU memory. ([A100 datasheet](https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/a100/pdf/nvidia-a100-datasheet-nvidia-us-2188504-web.pdf+external))

L40S cards are all-rounders; they've got tensor cores, RT cores, and NVENC/NVDEC, and have 48GB of GPU RAM. Choose the L40S to accelerate graphics or video workloads, as well as for inference. ([L40S datasheet](https://resources.nvidia.com/en-us-l40s/l40s-datasheet-28413+external))

A10 cards are all-arounders with less GPU RAM. They've got tensor cores, shader cores, NVENC/NVDEC, and can run Llama 3 8B at float16 without breaking the bank. Choose the A10 when you don't need more than 8 billion parameters. This works great for smaller large language models, Stable Diffusion, and other such workflows. ([A10 datasheet](https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/a10/pdf/a10-datasheet.pdf+external))


Right now each Fly GPU Machine uses a single full GPU. A single GPU is well suited to rendering, encoding/decoding, inference, and a smidgen of fine tuning. Training large models from scratch requires much, much beefier resources.

Go to the [GPU Quickstart](https://fly.io/docs/gpus/gpu-quickstart/) to get off the ground fast, or read more practicalities in [Getting started with Fly GPUs](/docs/gpus/getting-started-gpus/).

## Regions with GPUs

Currently GPUs are available in the following regions:

- `a10`: `ord`
- `l40s`: `ord`
- `a100-40gb`: `ord`
- `a100-80gb`: `iad`, `sjc`, `syd`

## Examples

Here's some more inspiration for your GPU Machines project:

- [Python GPU Dev Machine](/docs/gpus/python-gpu-example/)
- [Elixir Llama2-13b on Fly.io GPUs](https://gist.github.com/chrismccord/59a5e81f144a4dfb4bf0a8c3f2673131)
- [Fly.io CUDA example](https://gist.github.com/dangra/f8123001fe0f2453a8cd638b89738465)
- [Deploying CLIP on Fly.io](https://gist.github.com/simonw/52c7734e34cac2b26ea1378845674edc)
- [GitHub `fly-apps` repos with the `gpu` topic](https://github.com/orgs/fly-apps/repositories?q=topic%3Agpu)
