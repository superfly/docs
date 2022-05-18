```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/${FLY\_APP\_NAME}/machines/24d899e6c93879" 

```
**Status: 200**
```json
{
  "id": "24d899e6c93879",
  "name": "quirky-machine",
  "state": "started",
  "region": "cdg",
  "instance\_id": "01G3BZ7C89Z46HBAVKY1BJ55BR",
  "private\_ip": "fdaa:0:3ec2:a7b:5b66:ce41:374:2",
  "config": {
    "env": null,
    "init": {
      "exec": null,
      "entrypoint": null,
      "cmd": null,
      "tty": false
    },
    "image": "nginx",
    "metadata": null,
    "restart": {
      "policy": ""
    },
    "services": [
      {
        "internal\_port": 80,
        "ports": [
          {
            "handlers": [
              "tls",
              "http"
            ],
            "port": 443
          },
          {
            "handlers": [
              "http"
            ],
            "port": 80
          }
        ],
        "protocol": "tcp"
      }
    ],
    "guest": {
      "cpu\_kind": "shared",
      "cpus": 1,
      "memory\_mb": 256
    }
  },
  "image\_ref": {
    "registry": "registry-1.docker.io",
    "repository": "library/nginx",
    "tag": "latest",
    "digest": "sha256:61face6bf030edce7ef6d7dd66fe452298d6f5f7ce032afdd01683ef02b2b841",
    "labels": {
      "maintainer": "NGINX Docker Maintainers <docker-maint@nginx.com>"
    }
  },
  "created\_at": "2022-05-18T16:15:13Z",
  "events": [
    {
      "type": "start",
      "status": "started",
      "source": "flyd",
      "timestamp": 1652890515271
    },
    {
      "type": "launch",
      "status": "created",
      "source": "user",
      "timestamp": 1652890513696
    }
  ]
}
```