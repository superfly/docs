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

Let's make a multi-stage `Dockerfile` from scratch. Here's part 1:

<div class="note icon">
In this example we assume the use of `poetry`, however you can adapt the file to work with other dependency managers too.
</div>

```dockerfile
FROM python:3.11.9-bookworm AS builder

ENV PYTHONUNBUFFERED=1 \ 
    PYTHONDONTWRITEBYTECODE=1 

RUN pip install poetry && poetry config virtualenvs.in-project true

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN poetry install
```

So what's going on here? First, we use a "fat" python 3.11.9 image and installing and building all dependencies. Defining it as `builder` gives us a way to interact with it later. What essentially happens here is exactly what happens when you install a project locally using poetry: a `.venv/` directory is created and in it are all your built dependencies and binaries. You can inspect your own `.venv/` folder to see what that looks like. This directory is the primary artifact that we want.

Part 2, the runtime, looks something like this:

```dockerfile
FROM python:3.11.9-slim-bookworm

WORKDIR /app

COPY --from=builder /app .
COPY [python-app]/ ./[python-app]

CMD ["/app/.venv/bin/python", "[python-app]/app.py"]
```

Here we see very little actually going on; instead of the "fat" image, we now pick the slim variant. This one is about 5 times smaller in size, but is unable to compile many of the dependencies we would want compiled. We have already done that part though, so we can copy that `.venv/` folder over to this image without having to compile it again.

With this setup our image will be around 200MB most of the time (depending on what else you include). This setup is used for nearly all Python apps you deploy on Fly.io.

<div class="note icon">
The image size is largely dependent on what files you add in the dockerfile; by default the entire working directory is copied in. If you do not want to add certain files, you can specify them in a `.dockerignore` file.
</div>

