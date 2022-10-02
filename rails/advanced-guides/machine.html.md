---
title: Machine API
layout: framework_docs
objective: This guide shows use the Fly Machine API using Rails
status: beta
redirect_from: /docs/rails/advanced-guides/machine-api
---

This is a technology preview.  It demonstrates how you can launch fly
machines dynamically to perform background tasks from within a Rails
application.

Before proceeding, a bit of background.

Fly.io uses [Firecracker](https://firecracker-microvm.github.io/) to run VMs, and uses either [Nomad](https://www.nomadproject.io/) or [Machines](https://fly.io/docs/reference/machines/) for orchestration.  The default today is Nomad, but most of the new features are being implemented for Machines, so Machines are where you would look for upcoming features.

In a nutshell, the advantage of Nomad is that it performs high level orchestration.  The advantage of machines is that it is lower level.  Lower level means that at times you will need to do more work, but this also means that you have more control.

This guide focuses on Machines.

## Deploying a Rails project as a Fly.io Machine

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

Deploy your project

```cmd
bin/rails deploy
```

You have now successfully deployed a trivial Rails app Fly.io machines platform.

You can verify that this is running on the machines platform via `fly status`.
You can also run commands like `fly open` to bring your application up in the
browser.

Now lets make that application launch more machines.

## Installing `fly` on the Rails Machine

Since we will be using fly services from within our Rails application, we will need to install the fly executable.  We do that by adding the following lines to our `Dockerfile`:

```
RUN curl -L https://fly.io/install.sh | sh
ENV FLYCTL_INSTALL="/root/.fly"
ENV PATH="$FLYCTL_INSTALL/bin:$PATH"
```

A good place to put these lines is immediately before the `# Deploy your application` comment.

Next we need to make our Fly token available to our application:

```cmd
fly secrets set FLY_API_TOKEN=$(fly auth token)
```

## Add a controller

Lets generate a controller with three actions:

```cmd
bin/rails generate controller job start complete status
```

The three actions will be as follows:

  * `job/start` will be the URL you will load that will kick off a job.
  * `job/complete` will be the URL that job will fetch once it is complete.
  * `job/status` will be the URL you will load once the job is complete
     to see the results.

To keep things simple, all we are going to do is have these tasks write
timestamps to a file, one when the job starts, and one when the job
completes.  Status will return the results of the file.

The code to do this is straightforward:

```ruby
class JobController < ApplicationController
  skip_before_action :verify_authenticity_token

  def start
    File.write 'tmp/status', `date +"%d-%m-%Y %T.%N %Z"`
    url = "http://#{request.host_with_port}/job/complete"
    job = MachineJob.perform_later(url)
    render plain: "#{job}\n", layout: false
  end

  def complete
    File.write 'tmp/status', `date +"%d-%m-%Y %T.%N %Z"`, mode: 'a+'
    render plain: "OK\n", layout: false
  end

  def status
    render plain: IO.read('tmp/status'), layout: false
  end
end
```

Note that the `start` method provides the complete URL of the `complete` action
as a parameter to the machine job.

Before moving on, lets make sure that the file exists:

```cmd
touch tmp/status
```

## Add a Job

We start by generating a job:

```cmd
bin/rails generate job machine
```

Overall the tasks to be performed by this job:

  * Specify a machine configuration.  For simplicity we will use the
    same Fly application name and the same Fly image as our Rails
    application.  The server command will be `curl` specifying the
    URL that was passed as an argument to the job. 
  * Start a machine using this configuration, and
    check for errors, and log the results.
  * Query the status of the machine every 10 seconds for a maximum
    of 5 minutes, checking to see if the machine has exited.
  * Extract the exit code and log the state.  If the machine has
    exited successfully we delete the machine, otherwise we leave it
    around so that further forensics can be performed.

The implementation of this plan is as follows:

```ruby
require 'fly.io-rails/machines'

class MachineJob < ApplicationJob
  queue_as :default

  def perform(url)
    if Rails.env.production?
      # specify a machine configuration
      app = ENV['FLY_APP_NAME']

      config = {
        image: ENV['FLY_IMAGE_REF'],
        guest: {cpus: 1, memory_mb: 256, cpu_kind: "shared"},
        env: {'SERVER_COMMAND' => "curl #{url}"}
      }

      # start a machine
      start = Fly::Machines.create_and_start_machine(app, config: config)
      machine = start[:id]

      if machine
        logger.info "Started machine: #{machine}"
      else
        logger.error 'Error starting job machine'
        logger.error JSON.pretty_generate(start)
        return
      end

      # wait for machine to copmlete, checking every 10 seconds,
      # and timing out after 5 minutes.
      event = nil
      30.times do
        sleep 10
        status = Fly::Machines.get_a_machine app, machine
        event = status[:events]&.first
        break if event && event[:type] == 'exit'
      end

      # extract exit code
      exit_code = event.dig(:request, :exit_event, :exit_code)

      if exit_code == 0
        # delete job machine
        delete = Fly::Machines.delete_machine app, machine
        if delete[:error]
          logger.error "Error deleting machine: #{machine}"
          logger.error JSON.pretty_generate(delete)
        else
          logger.info "Deleted machine: #{machine}"
        end
      else
        logger.error 'Error performing job'
        logger.error (exit_code ? {exit_code: exit_code} : event).inspect
      end
    else
      system "curl", url
    end
  end
end
```

Note in particular the calls to `Fly::Machines`:

  * [`Fly::Machines.create_and_start_machine`](https://fly.io/docs/reference/machines/#create-and-start-a-machine)
  * [`Fly::Machines.get_a_machine`](https://fly.io/docs/reference/machines/#get-a-machine)
  * [`Fly::Machines.delete_machine`](https://fly.io/docs/reference/machines/#delete-a-machine-permanently)

Each of the lines in the list above is a link to the documentation for that API.

The key difference is that instead of passing in and receiving back a JSON object, you pass in and receive back a Ruby hash.  And all of the URLs and HTTP headers are taken care of for you by the `Fly::Machine` module.

For those interested in the inner workings, the source to [Fly::Machine](https://github.com/rubys/fly.io-rails/blob/main/lib/fly.io-rails/machines.rb) is on GitHub.  Again, all this is beta, and subject to change.

## Trying it out

We are now ready to deploy, but before we do in a separate window start watching the log::

```cmd
fly logs
```

Now deploy the application:

```cmd
bin/rails deploy
```

If you run `fly open` you will arrive at your application's welcome page.
Take a note of the URL.  Either in the browser or in a command window add
`/job/start`.  As a response (either in your browser or terminal window
you will see something like:

```
#<MachineJob:0x00007f2b31b047e0>
```

Switching to your log window you should see output similar to the following:


```
2022-09-20T04:07:59Z app[9080514c12d787] iad [info]I, [2022-09-20T04:07:59.525790 #514]  INFO -- : [b2f7eb1f-e552-445d-84ac-72d4a63fa4d4] Started GET "/job/start" for 168.220.92.2 at 2022-09-20 04:07:59 +0000
2022-09-20T04:07:59Z app[9080514c12d787] iad [info]I, [2022-09-20T04:07:59.529213 #514]  INFO -- : [b2f7eb1f-e552-445d-84ac-72d4a63fa4d4] Processing by JobController#start as HTML
2022-09-20T04:07:59Z app[9080514c12d787] iad [info]I, [2022-09-20T04:07:59.541820 #514]  INFO -- : [b2f7eb1f-e552-445d-84ac-72d4a63fa4d4] [ActiveJob] Enqueued MachineJob (Job ID: 7984003d-bb82-4815-acff-81d1ba91539f) to Async(default) with arguments: "http://weathered-sunset-3812.fly.dev/job/complete"
2022-09-20T04:07:59Z app[9080514c12d787] iad [info]I, [2022-09-20T04:07:59.544837 #514]  INFO -- : [b2f7eb1f-e552-445d-84ac-72d4a63fa4d4]   Rendered text template (Duration: 0.0ms | Allocations: 8)
2022-09-20T04:07:59Z app[9080514c12d787] iad [info]I, [2022-09-20T04:07:59.545257 #514]  INFO -- : [b2f7eb1f-e552-445d-84ac-72d4a63fa4d4] Completed 200 OK in 16ms (Views: 2.9ms | Allocations: 1056)
2022-09-20T04:07:59Z app[9080514c12d787] iad [info]I, [2022-09-20T04:07:59.546683 #514]  INFO -- : [ActiveJob] [MachineJob] [7984003d-bb82-4815-acff-81d1ba91539f] Performing MachineJob (Job ID: 7984003d-bb82-4815-acff-81d1ba91539f) from Async(default) enqueued at 2022-09-20T04:07:59Z with arguments: "http://weathered-sunset-3812.fly.dev/job/complete"
2022-09-20T04:07:59Z app[9080514c12d787] iad [info]E, [2022-09-20T04:07:59.546905 #514] ERROR -- : [ActiveJob] [MachineJob] [7984003d-bb82-4815-acff-81d1ba91539f] danger
2022-09-20T04:07:59Z runner[5683009c17548e] iad [info]Reserved resources for machine '5683009c17548e'
2022-09-20T04:07:59Z runner[5683009c17548e] iad [info]Pulling container image
2022-09-20T04:08:00Z app[9080514c12d787] iad [info]I, [2022-09-20T04:08:00.071564 #514]  INFO -- : [ActiveJob] [MachineJob] [7984003d-bb82-4815-acff-81d1ba91539f] Started machine: 5683009c17548e
2022-09-20T04:08:00Z runner[5683009c17548e] iad [info]Unpacking image
2022-09-20T04:08:02Z runner[5683009c17548e] iad [info]Configuring firecracker
2022-09-20T04:08:03Z app[5683009c17548e] iad [info]  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
  0     0    0     0    0     0  load  Upload   Total   Spent    Left  Speed
2022-09-20T04:08:04Z app[9080514c12d787] iad [info]I, [2022-09-20T04:08:04.813284 #514]  INFO -- : [c6131d3b-bcba-4ab7-88cb-3e07800ec6b2] Started GET "/job/complete" for 2a09:8280:1::7635 at 2022-09-20 04:08:04 +0000
2022-09-20T04:08:04Z app[9080514c12d787] iad [info]I, [2022-09-20T04:08:04.814303 #514]  INFO -- : [c6131d3b-bcba-4ab7-88cb-3e07800ec6b2] Processing by JobController#complete as */*
2022-09-20T04:08:04Z app[9080514c12d787] iad [info]I, [2022-09-20T04:08:04.826253 #514]  INFO -- : [c6131d3b-bcba-4ab7-88cb-3e07800ec6b2]   Rendered text template (Duration: 0.0ms | Allocations: 2)
2022-09-20T04:08:04Z app[9080514c12d787] iad [info]I, [2022-09-20T04:08:04.827434 #514]  INFO -- : [c6131d3b-bcba-4ab7-88cb-3e07800ec6b2] Completed 200 OK in 13ms (Views: 2.1ms | Allocations: 167)
100     3    0     3    0     0      1      0 --:--:--  0:00:02 --:--:--     2
2022-09-20T04:08:04Z app[5683009c17548e] iad [info]OK
2022-09-20T04:08:07Z runner[5683009c17548e] iad [info]machine exited with exit code 0, not restarting
2022-09-20T04:08:10Z app[9080514c12d787] iad [info]I, [2022-09-20T04:08:10.238155 #514]  INFO -- : [ActiveJob] [MachineJob] [7984003d-bb82-4815-acff-81d1ba91539f] Deleted machine: 5683009c17548e
2022-09-20T04:08:10Z app[9080514c12d787] iad [info]I, [2022-09-20T04:08:10.238536 #514]  INFO -- : [ActiveJob] [MachineJob] [7984003d-bb82-4815-acff-81d1ba91539f] Performed MachineJob (Job ID: 7984003d-bb82-4815-acff-81d1ba91539f) from Async(default) in 10691.24ms
```

And, finally, visit `/job/status` to see the results.  Durations will vary, but I'm currently seeing a total elapsed time of anywhere from about two and a half seconds to five seconds.

## Recap

While not exactly a realistic application, this application demonstrates a number of important features.  Scheduling a job.  Launching, monitoring, and removing a machine.  Inter-machine communications.

With the right parameters, you can start machines in remote geographic locations or with volumes attached.  These machines will have access to your application's secrets so they can access databases or other cloud services.  And if you go back and look at the `main.tf` file in your application directory you can get an indication of what steps are required, and what options are required for each step, to launch a Rails application.

The possibilities are unlimited.

At the moment, this is only a preview, so API names and options may change.
But do try this out, and if you have questions or come up with an exciting
usage of this, let us know on [community.fly.io](https://community.fly.io/).
