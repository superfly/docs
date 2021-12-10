<p class="font-medium tracking-tight text-gray-400 text-lg -mt-4 mb-9 pb-5 border-b">
  Commands that manage SSH credentials
</p>

## About

Commands that manage SSH credentials

## Usage

~~~
flyctl ssh [command] [flags]
~~~

### Available Commands
* [console](/docs/flyctl/ssh-console/)	 - Connect to a running instance of the current app.
* [establish](/docs/flyctl/ssh-establish/)	 - Create a root SSH certificate for your organization
* [issue](/docs/flyctl/ssh-issue/)	 - Issue a new SSH credential.
* [log](/docs/flyctl/ssh-log/)	 - Log of all issued certs

## Options

~~~
  -h, --help   help for ssh
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl](/docs/flyctl/help/)	 - The Fly CLI

