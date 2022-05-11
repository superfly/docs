#!/usr/bin/env ruby

require 'json'
require 'faraday'

HOSTNAME = "_flaps.internal:4280"
APP_NAME = "js-machines-test-2"
FLY_ORG = "fly-ephemeral"

def token
  `fly auth token`
end

def curl(method, path, body = nil)
  full_path = "/v1/#{path}"
  cmd = <<-CMD
curl -i -X#{method.to_s.upcase} \\
  -H "Authorization: Bearer ${FLY_API_TOKEN}" -H "Content-Type: application/json" \\
  "http://#{HOSTNAME}#{full_path}" \\
-d '#{JSON.pretty_generate(body)}'
  CMD

  conn = Faraday.new(
    url: "http://#{HOSTNAME}",
    headers: {
      "Authorization": "Bearer #{token}",
      "Content-Type": "application/json"
    }
  )
  response = conn.send(method, full_path) do |req|
    req.body = body.to_json
  end
  puts cmd
  puts JSON.pretty_generate(JSON.parse(response.body))
end

def create_app
  body = {
    app_name: APP_NAME,
    org_slug: FLY_ORG
  }
  curl(:post, "apps", body)
end


def launch_machine
  body = {
    name: "machine-name2",
    config: {
      "image": "nginx"
    }
  }
  curl(:post, "apps/#{APP_NAME}/machines", body)
end

# create_app
launch_machine