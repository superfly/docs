Update an existing Tigris object storage bucket


## Usage
~~~
fly storage update <bucket_name> [flags]
~~~

## Options

~~~
  -a, --app string                 Application name
      --clear-shadow               Remove an existing shadow bucket
  -c, --config string              Path to application configuration file
  -h, --help                       help for update
  -o, --org string                 The target Fly.io organization
      --private                    Set a public bucket to be private
  -p, --public                     Objects in the bucket should be publicly accessible
      --shadow-access-key string   Shadow bucket access key
      --shadow-endpoint string     Shadow bucket endpoint
      --shadow-name string         Shadow bucket name
      --shadow-region string       Shadow bucket region
      --shadow-secret-key string   Shadow bucket secret key
      --shadow-write-through       Write objects through to the shadow bucket
  -y, --yes                        Accept all confirmations
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
      --debug                 Print additional logs and traces
      --verbose               Verbose output
~~~

## See Also

* [fly storage](/docs/flyctl/storage/)	 - Provision and manage Tigris object storage buckets

