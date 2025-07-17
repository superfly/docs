---
title: Deferring long-running tasks to a distributed work queue
layout: docs
nav: firecracker
author: kcmartin
date: 2025-07-17
---

## Overview

Some things just take a while. Generating a PDF. Calling a slow third-party API. Running a machine learning model. Sending an email newsletter, and retrying if the mail server flakes out.

Whatever the reason, if your web app is sitting around waiting for that work to finish, you're doing it wrong. Not just in the “inefficient” sense—but in the “your app will time out and confuse users and make debugging miserable” sense.

Instead, you should offload that work to a background worker.

This isn’t a new idea. The pattern’s been around forever, often called a **“work queue”** or **“job queue.”** Here’s the gist:

- The web app gets a request.
- Instead of doing everything right away, it drops a job onto a queue.
- A separate process—called a worker—pulls jobs from that queue and handles them in the background.

This means your web handler can respond immediately. It also means your background work can run on different machines, retry on failure, and scale independently from your frontend.

You’ve probably already used something like this without realizing it. Ever sent an email via a task queue? That was a worker. Ever seen a spinner on a dashboard while a report gets generated? There's probably a job queue behind it.

In this guide, we’ll show you how to set this up—using Celery if you're in Python, BullMQ if you're in Node, and Fly Machines if you're allergic to running idle containers.

If you're already comfortable with queues, skip ahead. But if you’ve been stuffing async tasks into HTTP handlers and hoping for the best, this is your exit ramp. Let’s clean it up.

---

## Why use a work queue?

- **Responsiveness**: Return HTTP responses instantly. Let workers take their time.
- **Scalability**: Scale web servers and workers independently. No need to waste compute on idle async calls.
- **Retries**: Jobs can fail and retry cleanly, without blocking a request or annoying a user.
- **Cost efficiency**: With Fly Machines, you only pay for worker time while the job is running.
- **Persistence**: Jobs don’t care if a user closes their browser tab. Work still gets done.

---

## Redis and Valkey

Most of the tools in this guide use [Redis](https://redis.io/about/) as a message broker—a fast, in-memory data store that's great for short-lived messages and task queues. If you're deploying on Fly.io, we recommend trying [Valkey](https://valkey.io/), a fork of Redis with a more active community and governance model. You can set up a Valkey cluster without needing an Enterprise license. It works the same way but gives you more flexibility and long-term stability. You can deploy either Redis or Valkey yourself or use a managed service like [Upstash Redis](/docs/upstash/redis/).

---

## Option 1: Celery (Python)

[Celery](https://docs.celeryq.dev/en/latest/getting-started/introduction.html) is a full-featured task queue commonly used with Django and Flask.

### How it works

1. Your app enqueues a task to a message broker (Redis or RabbitMQ).
1. A worker process picks up the task from the queue and executes it.
1. Task results can optionally be stored (e.g., in Redis or your database).

### Setup

Install the basics:

```bash
pip install "celery[redis]" django-celery-results
```

Create a `celery.py`:

```python
from celery import Celery

app = Celery("my_app")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
```

Use `@shared_task` for defining tasks:

```python
from celery import shared_task

@shared_task(bind=True, autoretry_for=(Exception,), retry_backoff=3, retry_kwargs={"max_retries": 5})
def crunch_numbers(self, arg):
    ...
```

Run your worker:

```bash
celery -A my_app worker -l info
```

### Deploying to Fly.io

Use `fly launch` to generate config and add Upstash Redis.

Update `fly.toml`:

```
[processes]
app = "gunicorn my_app.wsgi"
worker = "celery -A my_app worker -l info"
```

Then:

```bash
fly deploy
fly scale count worker=2
```

<div class="callout">**Region tip**: Put your Redis instance and workers in the same region (e.g. `ord`, `fra`) to avoid unnecessary latency and weird race conditions. </div>

---

## Option 2: On-Demand Workers with Fly Machines

You don’t always need a persistent queue and worker pool. For low-frequency or one-off jobs, you can spin up a Fly Machine per task.

### How it works

1. Your app writes a job (params, metadata) to Redis/Valkey.
1. It calls the Fly Machines API to spin up a temporary worker.
1. The worker reads job data from Redis, runs it, and writes back the result.
1. Your app polls Redis to check status and fetch results.
1. You shut down the machine and clean up.

This is great for jobs that don’t happen often, and it keeps your infrastructure lean. You can reuse your app image or build a dedicated worker image.

Just make sure your job data and results are JSON-serializable.

---

## Option 3: BullMQ (Node.js)

BullMQ is a Redis-backed queue system for Node.js apps. It works similarly to Celery:

- Your app enqueues jobs to Redis/Valkey.
- Workers pull jobs and execute them.
- You get features like retries, rate limits, job delays, and concurrency control.

BullMQ plays nicely with TypeScript, has good docs, and integrates well with modern backend frameworks like NestJS.

Provision Redis via Upstash or use `fly redis create`.

Scale workers as needed based on job load and machine size:

```javascript
const worker = new Worker("my-queue", async job => {
  // do your work here
}, { concurrency: 4 });
```

---

## Other Options

If none of the above tools fit your stack or mental model, there are plenty of alternatives:

- **Sidekiq** (Ruby): The de facto standard for background jobs in Ruby and Rails apps. Redis-backed, battle-tested, and fast.
- **Oban** (Phoenix) A robust background job processing library for Elixir 
- **RQ** (Python): A simpler, more lightweight job queue than Celery, great for smaller projects or simpler needs.

Most of these integrate with Redis/Valkey, some support more exotic brokers (like Postgres or Kafka), and all of them can be deployed on Fly.io with the right setup.

---

## Final Notes

Whatever you do, don’t handle long-running jobs inside your HTTP request handlers. Use a job queue. Pick the right tool for your stack and use case, and let your web server get back to doing what it’s good at—responding fast and not melting down under load.



## Related reading

- [Async workers on Fly Machines](https://fly.io/blog/python-async-workers-on-fly-machines/)
- [Celery and Django for async tasks](https://fly.io/django-beats/celery-async-tasks-on-fly-machines/)
