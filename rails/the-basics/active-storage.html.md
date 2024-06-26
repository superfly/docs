---
title: Active Storage
layout: framework_docs
objective: Provision a Tigris Server and configure Rails to run Active Storage.
order: 4
---

Fly.io is a great place to deploy Rails applications that make use of [Active Storage](https://edgeguides.rubyonrails.org/active_storage_overview.html), and  Fly.io knows that Rails users prefer Convention over Configuration and their menus Omakase.

## Launching a new Application?

If any of the following are true, [`fly launch`](/docs/flyctl/launch/) will take care of all of the configuration:

 * `aws-sdk-s3` in `Gemfile` or `Gemfile.lock`
 * any migration containing `active_storage_attachments`
 * an uncommented line in `config/storage.yml` containing `service: S3`

Don't want Tigris for any reason?  Hey - we don't judge here.  Simply disable the extension in the web UI, and [setup](https://edgeguides.rubyonrails.org/active_storage_overview.html#setup) active storage for yourself.

![Tigris Launch-UI](/docs/images/tigris-launch-ui.png)

## Adding Tigris to an existing application?

No problem!  [Create a storage bucket](/docs/reference/tigris/) and let [`dockerfile-rails`](https://github.com/fly-apps/dockerfile-rails?tab=readme-ov-file#overview) do the configuring for you:

```
bin/rails generate dockerfile --tigris
```

Note: you don't need to accept changes to your `Dockerfile`, `.dockerignore`,
`bin/docker-entrypoint` or other files.  The only files that need to be updated are:

  * `config/storage.yml`
  * `config/environments/production.rb`

## Want a demo?

Following is a quick and dirty demo that enables you to upload files containing images, audio, video, and other assorted files for viewing and/or downloading.

First, some scaffolding:

```
rails new filelist --css tailwind
cd filelist
bin/rails active_storage:install
bin/rails generate scaffold Item name:string contents:attachment
bin/rails db:migrate
```

Next we need to modify three files to complete the application.

  * [diffs](https://gist.github.com/rubys/20ea2562b9e7d23e3f01a6852f30d731)
  * [full files](https://gist.github.com/rubys/c9f0e28727b58365477ce2b858f26355)

With this in place, you are ready to launch:

```bash
fly launch
```

Watch the app deploy and then upload, view, and download a few files!