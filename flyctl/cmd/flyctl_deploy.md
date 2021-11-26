# _flyctl deploy_

Deploy an app to the Fly platform

### About

Deploy an application to the Fly platform. The application can be a local
image, remote image, defined in a Dockerfile or use a CNB buildpack.

Use the --config/-c flag to select a specific toml configuration file.

Use the --image/-i flag to specify a local or remote image to deploy.

Use the --detach flag to return immediately from starting the deployment rather
than monitoring the deployment progress.

Use flyctl monitor to restart monitoring deployment progress

### Usage
~~~
flyctl deploy [<workingdirectory>] [flags]
~~~

### Options

~~~
  -a, --app string            App name to operate on
      --build-arg strings     Set of build time variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --build-only            
      --build-target string   Set the target build stage to build if the Dockerfile has more than one stage
  -c, --config string         Path to an app config file or directory containing one (default "./fly.toml")
      --detach                Return immediately instead of monitoring deployment progress
      --dockerfile string     Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
  -e, --env strings           Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
  -h, --help                  help for deploy
  -i, --image string          Image tag or id to deploy
      --image-label string    Image label to use when tagging and pushing to the fly registry. Defaults to "deployment-{timestamp}".
      --local-only            Only perform builds locally using the local docker daemon
      --no-cache              Do not use the cache when building the image
      --remote-only           Perform builds remotely without using the local docker daemon
      --strategy string       The strategy for replacing running instances. Options are canary, rolling, bluegreen, or immediate. Default is canary, or rolling when max-per-region is set.
~~~

### Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

### See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

