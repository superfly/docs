Launch a Heroku app on Fly.io

## Usage
~~~
flyctl turboku <heroku-app-name> <heroku-api-token> [flags]
~~~

## Options

~~~
      --auto-confirm                     Will automatically confirm changes when running non-interactively.
      --build-arg stringArray            Set of build time variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --build-only                       Build but do not deploy
      --build-secret stringArray         Set of build secrets of NAME=VALUE pairs. Can be specified multiple times. See https://docs.docker.com/develop/develop-images/build_enhancements/#new-docker-build-secret-information
      --build-target string              Set the target build stage to build if the Dockerfile has more than one stage
      --detach                           Return immediately instead of monitoring deployment progress
      --dockerfile string                Path to a Dockerfile. Defaults to the Dockerfile in the working directory.
  -e, --env stringArray                  Set of environment variables in the form of NAME=VALUE pairs. Can be specified multiple times.
      --file-literal stringArray         Set of literals in the form of /path/inside/machine=VALUE pairs where VALUE is the content. Can be specified multiple times.
      --file-local stringArray           Set of files in the form of /path/inside/machine=<local/path> pairs. Can be specified multiple times.
      --file-secret stringArray          Set of secrets in the form of /path/inside/machine=SECRET pairs where SECRET is the name of the secret. Can be specified multiple times.
      --ha                               Create spare machines that increases app availability (default true)
  -h, --help                             help for turboku
      --ignorefile string                Path to a Docker ignore file. Defaults to the .dockerignore file in the working directory.
  -i, --image string                     The Docker image to deploy
      --image-label string               Image label to use when tagging and pushing to the fly registry. Defaults to "deployment-{timestamp}".
      --keep                             keep the app directory after deployment
      --lease-timeout int                Seconds to lease individual machines while running deployment. All machines are leased at the beginning and released at the end. The lease is refreshed periodically for this same time, which is why it is short. flyctl releases leases in most cases. (default 13)
      --local-only                       Only perform builds locally using the local docker daemon
      --name string                      the name of the new app
      --nixpacks                         Deploy using nixpacks to build the image
      --no-cache                         Do not use the build cache when building the image
      --no-deploy                        Do not prompt for deployment
      --no-public-ips                    Do not allocate any new public IP addresses
      --now                              Deploy now without confirmation
  -o, --org string                       The target Fly organization
      --provision-extensions             Provision any extensions assigned as a default to first deployments
      --push                             Push image to registry after build is complete
  -r, --region string                    The target region (see 'flyctl platform regions')
      --release-command-timeout string   Seconds to wait for a release command finish running, or 'none' to disable. (default "300")
      --remote-only                      Perform builds on a remote builder instance instead of using the local docker daemon
      --smoke-checks                     Perform smoke checks during deployment (default true)
      --strategy string                  The strategy for replacing running instances. Options are canary, rolling, bluegreen, or immediate. Default is canary, or rolling when max-per-region is set.
      --strategy-batch                   For "rolling" and "canary": batch Machine updates into 3 groups when updating more than 4. (default true)
      --vm-cpukind string                The kind of CPU to use ('shared' or 'performance')
      --vm-cpus int                      Number of CPUs
      --vm-memory int                    Memory (in megabytes) to attribute to the VM
      --vm-size string                   The VM size to use when deploying for the first time. See "fly platform vm-sizes" for valid values
      --wait-timeout int                 Seconds to wait for individual machines to transition states and become healthy. (default 120)
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --verbose               Verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

