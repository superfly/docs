Create a health check handler

## Usage
~~~
flyctl checks handlers create [flags]
~~~

## Options

~~~
  -h, --help                     help for create
      --name string              The name of the handler
      --organization string      The organization to add the handler to
      --pagerduty-token string   The PagerDuty token
      --slack-channel string     The Slack channel
      --type string              The type of handler to create, can be slack or pagerduty
      --webhook-url string       The Slack webhook url
~~~

## Global Options

~~~
  -t, --access-token string   Fly API Access Token
  -j, --json                  json output
      --verbose               verbose output
~~~

## See Also

* [flyctl checks handlers](/docs/flyctl/checks-handlers/)	 - Manage health check handlers

