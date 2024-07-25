---
title: "Setting up a Python Environment"
layout: framework_docs
objective: How to setup a functional python environment on your local machine.
order: 0
---

## Initial Local Setup

Make sure that [Python](https://www.python.org/) is already installed on your computer along with a way to create virtual environments.

This allows you to run your project locally, and test that it works, before deploying it to Fly.io.

<section class="callout">
We recommend the latest [supported versions](https://devguide.python.org/versions/#supported-versions) of Python.
</section>

## Dependency Management

For project and dependency management we use [Poetry](https://python-poetry.org/). Like most package managers, Poetry combines multiple tools in one. 

You have other options:
- [venv](https://docs.python.org/3/library/venv.html) and [pip](https://pip.pypa.io/)
- [Pipenv](https://github.com/pypa/pipenv)
- [pyenv](https://github.com/pyenv/pyenv)
- [pip-tools](https://pypi.org/project/pip-tools/)

If you are just starting out, it is easiest to follow along using `poetry`. 
After installing it, you will have to set 2 flags for virtual environment management.

```cmd
poetry config virtualenvs.create true
poetry config virtualenvs.in-project true
```

This will make your development environment resemble what ends up happening inside the docker image. 

You can create a new project using this command:

```cmd
poetry new <app-name>
```

Once inside the project, you can add packages with the add command:

```cmd
poetry add <dep>
```

This will automatically create a virtual environment for you. 

To interact with your virtual environment, you can prefix your commands with `poetry run`:

```cmd
poetry run python main.py
```

Alternatively, you can activate the environment:

```cmd
poetry shell
python main.py
```

