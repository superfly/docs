```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/my-awesome-machine-app/machines/24d899e0b33879" 

```
**Status: 200**
```json
{
  "id": "24d899e0b33879",
  "name": "quirky-machine",
  "state": "started",
  "region": "cdg",
  "instance\_id": "01G2WMJ7V5QX1SBTCTCP12B0HJ",
  "private\_ip": "fdaa:0:3ec2:a7b:5adc:9d98:ef02:2",
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
    "guest": {
      "cpu\_kind": "shared",
      "cpus": 2,
      "memory\_mb": 512
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
  "created\_at": "2022-05-12T17:20:14Z",
  "events": [
    {
      "type": "start",
      "status": "started",
      "source": "flyd",
      "timestamp": 1652376022515
    },
    {
      "type": "launch",
      "status": "created",
      "source": "user",
      "timestamp": 1652376018789
    }
  ]
}
```