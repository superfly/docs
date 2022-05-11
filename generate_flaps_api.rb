#!/usr/bin/env ruby

require 'json'
require 'faraday'

HOSTNAME = "_flaps.internal:4280"
APP_NAME = "my-awesome-machine-app"
FLY_ORG = "fly-ephemeral"

def token
  `fly auth token`
end

def curl(method, path, body = nil)
  full_path = "/v1/#{path}"
  cmd = <<-CMD
curl -i -X#{method.to_s.upcase} \\
  -H "Authorization: Bearer ${FLY_API_TOKEN}" -H "Content-Type: application/json" \\
  "http://#{HOSTNAME}#{full_path}"
  CMD

  if body
    cmd << "\n  -d '#{JSON.pretty_generate(body)}'"
  end
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

  puts "#{cmd}"

  puts "Status: #{response.status}"
  if response.body.size > 0
    puts JSON.pretty_generate(JSON.parse(response.body))
  else
    puts "No response body"
  end
  puts
end

def create_app
  body = {
    app_name: APP_NAME,
    org_slug: FLY_ORG
  }
  curl(:post, "apps", body)
end

def delete_app
  body = {
    app_name: APP_NAME
  }
  curl(:delete, "apps/#{APP_NAME}")
end


def launch_machine
  body = {
    name: "quirky-machine",
    config: {
      "image": "nginx"
    }
  }
  curl(:post, "apps/#{APP_NAME}/machines", body)
end

delete_app
create_app
launch_machine