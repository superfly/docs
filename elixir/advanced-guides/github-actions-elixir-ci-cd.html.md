---
title: GitHub Actions for Elixir CI/CD
layout: framework_docs
order: 1
objective: Setup GitHub CI/CD for your Elixir project.
author: mark
categories:
  - elixir
date: 2022-11-06
---

You want the benefits of modern CI/CD for your Elixir projects? You're in the
right place!

## Continuous Integration (CI)

Continuous integration is a software development practice where developers
frequently merge code changes into a central repository. Automated builds and
tests are run to assert the new code's correctness before integrating the
changes into the main development branch. The goal is to find and correct bugs
faster, improve software quality and enable software releases to happen
faster.

To get started with GitHub Actions in your project, let's create a "test"
workflow. To do this, create this path and file in the root of your project:

`.github/workflows/elixir.yaml`

Let's look at a sample file. Comments are included to explain and document what
we're doing and why.

```yaml
name: Elixir CI

# Define workflow that runs when changes are pushed to the
# `main` branch or pushed to a PR branch that targets the `main`
# branch. Change the branch name if your project uses a
# different name for the main branch like "master" or "production".
on:
  push:
    branches: [ "main" ]  # adapt branch for project
  pull_request:
    branches: [ "main" ]  # adapt branch for project

# Sets the ENV `MIX_ENV` to `test` for running tests
env:
  MIX_ENV: test

permissions:
  contents: read

jobs:
  test:
    # Set up a Postgres DB service. By default, Phoenix applications
    # use Postgres. This creates a database for running tests.
    # Additional services can be defined here if required.
    services:
      db:
        image: postgres:12
        ports: ['5432:5432']
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    runs-on: ubuntu-latest
    name: Test on OTP ${{matrix.otp}} / Elixir ${{matrix.elixir}}
    strategy:
      # Specify the OTP and Elixir versions to use when building
      # and running the workflow steps.
      matrix:
        otp: ['25.0.4']       # Define the OTP version [required]
        elixir: ['1.14.1']    # Define the elixir version [required]
    steps:
    # Step: Setup Elixir + Erlang image as the base.
    - name: Set up Elixir
      uses: erlef/setup-beam@v1
      with:
        otp-version: ${{matrix.otp}}
        elixir-version: ${{matrix.elixir}}

    # Step: Check out the code.
    - name: Checkout code
      uses: actions/checkout@v3

    # Step: Define how to cache deps. Restores existing cache if present.
    - name: Cache deps
      id: cache-deps
      uses: actions/cache@v3
      env:
        cache-name: cache-elixir-deps
      with:
        path: deps
        key: ${{ runner.os }}-mix-${{ env.cache-name }}-${{ hashFiles('**/mix.lock') }}
        restore-keys: |
          ${{ runner.os }}-mix-${{ env.cache-name }}-

    # Step: Define how to cache the `_build` directory. After the first run,
    # this speeds up tests runs a lot. This includes not re-compiling our
    # project's downloaded deps every run.
    - name: Cache compiled build
      id: cache-build
      uses: actions/cache@v3
      env:
        cache-name: cache-compiled-build
      with:
        path: _build
        key: ${{ runner.os }}-mix-${{ env.cache-name }}-${{ hashFiles('**/mix.lock') }}
        restore-keys: |
          ${{ runner.os }}-mix-${{ env.cache-name }}-
          ${{ runner.os }}-mix-

    # Step: Download project dependencies. If unchanged, uses
    # the cached version.
    - name: Install dependencies
      run: mix deps.get

    # Step: Compile the project treating any warnings as errors.
    # Customize this step if a different behavior is desired.
    - name: Compiles without warnings
      run: mix compile --warnings-as-errors

    # Step: Check that the checked in code has already been formatted.
    # This step fails if something was found unformatted.
    # Customize this step as desired.
    - name: Check Formatting
      run: mix format --check-formatted

    # Step: Execute the tests.
    - name: Run tests
      run: mix test
```

### When the Workflow Runs...

When code is pushed to the `main` branch, this workflow is run. This happens
either from directly pushing to the `main` branch or after merging a PR into the
`main` branch.

This workflow is also configured to run checks on PR branches that target the
`main` branch. This is where it's most helpful. We can work on a fix or a new
feature in a branch and as we work and push our code up, it automatically runs
the full gamut of checks we want.

When all steps in the workflow succeed, the workflow "passes" and the automated
checks say it can be merged. When a step fails, the workflow halts at that point
and "fails", potentially blocking a merge.

### Customizing the Workflow Steps

This workflow is a starting point for a team. Every project is unique and every
team values different things. Is this missing something your team wants? Check
out some additional steps that can be added to your workflow.

- Add a step to run [Credo](https://github.com/rrrene/credo) checks.
- Add a step to run [Sobelow](https://github.com/nccgroup/sobelow) for security
  focused static analysis.
- Add a step to run [dialyxir](https://github.com/jeremyjh/dialyxir). This runs
  [Dialyzer](https://www.erlang.org/doc/man/dialyzer.html) static code analysis
  on the project. Refer to the project for tips on caching the PLT.
- Customize the `mix test` command to include [code coverage](https://hexdocs.pm/mix/main/Mix.Tasks.Test.html#module-coverage) checks.
- Add Node setup and caching if `npm` assets are part of the project's test suite.
- Add a step to run [mix_audit](https://github.com/mirego/mix_audit). This provides
  a `mix deps.audit` task to scan a project's Mix dependencies for known Elixir
  security vulnerabilities
- Add a step to run [`mix hex.audit`](https://hexdocs.pm/hex/Mix.Tasks.Hex.Audit.html).
  This shows all Hex dependencies that have been marked as retired, which the
  package maintainers no longer recommended using.

### Benefits of Caching

It's worth spending time tweaking your caches. Why? A lot of effort has been put
into speeding up Elixir build times. If we don't cache the build artifacts, then
we don't reap any of those benefits!

Of course, faster build times means you spend less money running your CI
workflow. But that's not the reason to do it! Better caches mean the checks are
performed faster and that means faster feedback. Faster feedback means that, as
a team, you save time and can move faster. No waiting 20 minutes for the checks
to complete so a PR can be merged. (Yes, I have felt that pain!)

This starting template builds in two caching steps. If `node_modules` factor
into your project's tests, then caching there makes a lot of sense too.

Just keep in mind that the reason we cache is to reduce drag on the speed of our
team.

If our caches ever cause a problem, and sometimes they can, it's good to know
how to clear them. In our project, go to Actions > (Sidebar) Management >
Caches. This is the list of caches saved for the project. We can use our naming
format to identify which cache file is for what.

### Additional Resources

- [Documentation: Caching dependencies to speed up workflows](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
  - [Managing Caches](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows#managing-caches)
- [erlef/setup-beam](https://github.com/erlef/setup-beam) - Set up your BEAM-based GitHub Actions workflow (Erlang, Elixir, and more)
  - See project for settings and ENV options
  - [Elixir setup action - Archived](https://github.com/actions/setup-elixir#phoenix-example) - Includes helpful examples like setting up the Postgres service database.

## Continuous Deployment (CD)

Continuous deployment is a software development practice that automatically
builds and releases the project into production when new changes pass automated
checks and are merged to the main branch. Using this practice, it is common to
release new versions of the applications multiple times a day, ideally, without
users even being aware of the process.

### Auto-Deploying our Elixir Applications

We can easily auto-deploy our Elixir applications on Fly. There is nothing
specific to Elixir about this process, so please refer to this guide for the details.

[Continuous Deployment with Fly and GitHub Actions](/docs/app-guides/continuous-deployment-with-github-actions/)
