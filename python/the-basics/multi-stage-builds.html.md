---
title: Multi-stage Builds
layout: framework_docs
objective: A strategy to make your containers smaller in size and reduce attack surface.
order: 3
---

Python apps need at the very least a Python runtime to be executed. However, sometimes you need much more to get a python app to work than just the runtime. Some dependencies need specific libraries and utilities to be built and compiled. For that reason many developers choose to use something called a multi-stage docker build.

In short, we split the process of building and compiling dependencies and running the app. This is good for a number of reasons:

- The resulting image is smaller in size
- The 'attack surface' of your application is smaller

Let's make a multi-stage `Dockerfile` using uv, based on the [uv-docker-example](https://github.com/astral-sh/uv-docker-example/raw/refs/heads/main/multistage.Dockerfile). Here's part 1:

```dockerfile
# Builder stage
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

WORKDIR /app

# Install dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# Copy the application code
ADD . /app

# Install the project
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev
```

So what's going on here? First, we use a slim Python image that includes `uv`. We set some environment variables and install all dependencies using `uv sync`. This stage is defined as `builder`, which gives us a way to interact with it later.

What essentially happens here is similar to what happens when you install a project locally using a package manager: dependencies are installed and the project is set up. The primary artifact we want is the installed project with all its dependencies.

Part 2, the runtime, looks something like this:

```dockerfile
# Runtime stage
FROM python:3.12-slim-bookworm

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app

# Place executables in the environment at the front of the path
ENV PATH="/app/.venv/bin:$PATH"

# Run the application
CMD ["python", "/app/src/your_app_name/main.py"]
```

Here we see very little actually going on; we use a slim Python image that matches the builder's Python version. We've already done the compilation and installation in the builder stage, so we can copy the entire `/app` directory (which includes the virtual environment) from the builder stage to this runtime image.

With this setup our image will be around 200MB most of the time (depending on what else you include). This setup is used for nearly all Python apps you deploy on Fly.io.

<div class="note icon">
The image size is largely dependent on what files you add in the dockerfile; by default the entire working directory is copied in. If you do not want to add certain files, you can specify them in a `.dockerignore` file.
</div>
