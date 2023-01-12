Fly.io allows you to deploy any kind of app as long as it is packaged in a **Docker image**. That also means you can just deploy a Docker image and as it happens we have one ready to go in `flyio/hellofly:latest`. 

Each Fly.io application needs a `fly.toml` file to tell the system how we'd like to deploy it. That file can be automatically generated with the `flyctl launch` command, which will ask a few questions to set everything up. Let's run through it now: 

```cmd
flyctl launch --image flyio/hellofly:latest
```
```output 
? App Name (leave blank to use an auto-generated name):
```
Here you can enter the name of the app. Please note that you can only use numbers, lowercase letters and dashes.
```output 
? Select organization: Personal (personal)
```
**Organizations**: Organizations are a way of sharing applications and resources between Fly.io users. Every Fly.io account has a personal organization, called `personal`, which is only visible to your account. Let's select that for this guide.

<div class="callout">
    If you did not add another organization to your account, the `personal` organization will be selected automatically.  
</div>

```output
? Select region: ord (Chicago, Illinois (US))
```
Next, you'll be prompted to select a region to deploy in. The closest region to you is selected by default. You can use this or change to another region. 


<div class="callout">

You will also be prompted for credit card payment information, required for charges outside the free allowances on Fly.io. See [Pricing](/docs/about/pricing) for more details.

</div>

```output
? Would you like to set up a Postgresql database now? (y/N)
```
Then CLI will ask if you need a Postgresql database. You can reply no for now.

At this point, `flyctl` creates an app for you and writes your configuration to a `fly.toml` file. The `fly.toml` file now contains a default configuration for deploying your app.

Lastly, the CLI will ask you if you would like to deploy now - please say no if your app doesn't use `internal_port = 8080`.

```output
? Would you like to deploy now? Yes
==> Building image
```

```toml

app = "hellofly"

[build]
  image = "flyio/hellofly:latest"

[[services]]
  internal_port = 8080

...
```

The `flyctl` command will always refer to this file in the current directory if it exists, specifically for the `app` name value at the start. That name will be used to identify the application on the Fly.io platform. You can also see how the app will be built and that internal port setting. The rest of the file contains settings to be applied to the application when it deploys. 

We'll have more details about these properties as we progress, but for now, it's enough to say that they mostly configure which ports the application will be visible on.

[Next: Deploying Your App](/docs/hands-on/deploy-app/)


We are now ready to deploy our containerized app. At the command line, just run:

```cmd
flyctl deploy
```

This will look up our `fly.toml` file, and get the app name `hellofly` from there. Then flyctl will start the process of deploying our application to the Fly.io platform. flyctl will return you to the command line when it's done.
