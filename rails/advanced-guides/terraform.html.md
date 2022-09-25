---
title: Terraform
layout: framework_docs
objective: This guide shows you how to deploy your Rails app on Fly Machines using Terraform
status: beta
---

This is a technology preview.

Looking for feedback on everything: technical correctness,
developer experience, what feature should be focused on next...

See also the [RFC: Terraforming Rails on fly.io](https://community.fly.io/t/rfc-terraforming-rails-on-fly-io/7133) and
[Getting started with Terraform and Machines ](https://fly.io/docs/app-guides/terraform-iac-getting-started/).

## Prerequisites

Go ahead and [download](https://learn.hashicorp.com/tutorials/terraform/install-cli) Terraform if you haven't yet.

Optionally, either [configure wireguard](https://fly.io/docs/reference/machines/#connecting-via-wireguard) or [run a proxy](https://fly.io/docs/reference/machines/#connecting-via-flyctl-proxy).  If you do neither, a proxy will be dynamically started and stopped as needed.

## Create a Rails project

```cmd
rails new welcome; cd welcome
```

Now use your favorite editor to make a one line change to `config/routes.rb`:

``` diff
 Rails.application.routes.draw do
   # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

   # Defines the root path route ("/")
-  # root "articles#index"
+  root "rails/welcome#index"
 end
 ```

 Install `fly.io-rails` gem:

 ```cmd
 bundle add fly.io-rails
 ```

Source to this gem is on [GitHub](https://github.com/rubys/fly.io-rails).  If
adopted, it will move to the superfly organization.


## Generate terraform configuration

```cmd
bin/rails generate fly:terraform
```

The terraform generator supports a number of options, for now it is worth letting them all default.  For completeness, the current list of options supported is:

  * `--name` - application name. If not specified, a name will be generated for you.
  * `--org` - the fly organization. Defaults to `personal`.
  * `--region` - one or more regions to deploy this app.  If not specified, fly wil pick one for you based on your location.

  More options can and should be added.  See
  [Fly terraform provider documentation](https://registry.terraform.io/providers/fly-apps/fly/latest/docs/resources/machine#optional) for ideas.

## Deploy the application

```cmd
bin/rails deploy
```

What this will do is:
  * Build your docker image using a remote builder
  * Push your image to the fly repository
  * Update `main.tf` with the name of the new image
  * Create a machine to run your release task
  * Wait for the release to complete
  * Remove the release machine
  * Run `terraform apply -auto-approve`

Once this completes -- whether it works or not, and there are plenty of
things that can go wrong -- feel free to modify `main.tf` and
rerun `terraform` commands directly.  You can even `terraform destroy` and
`rm terraform.tfstate` and start over.  What's important is `main.tf` already
reflects the name of the latest image.

Also, because a minimal `fly.toml` file was generated, you can use commands like `fly open`,
`fly ssh console` and `fly logs`.

## Open issues

 * It would be ideal to see the release task output in real time.
   Next best would be to show the output when the task completes.
   Currently the output isn't show and the machine is removed if
   the release was successful.  If the release fails, the machine
   is not removed and the command to show the logs is provided to
   the developer.
 * At the moment, the first image in the `main.tf` is updated when
   a new build is complete, and the first machine listed is run
   to perform a release.  Perhaps the template used to generate this
   should set the `SERVER_COMMAND` environment variable explicitly
   and the deploy command should scan for this in order to determine
   which image is to be updated and which machine is to be executed.
 * If you deploy using `fly deploy` directly (perhaps with
   [GitHub actions](https://fly.io/docs/app-guides/continuous-deployment-with-github-actions/)?), the image name in `main.tf` won't be updated.  You
   can obtain the current image name via the following command:

     <p>
     ```cmd
     fly ssh console -C 'printenv FLY_IMAGE_REF'
     ```
     </p>
