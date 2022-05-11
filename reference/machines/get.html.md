```cmd
curl -i -XGET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/my-awesome-machine-app/machines/59185369a92836" 

```
**Status: 200**
```json
{
  "id": "59185369a92836",
  "name": "quirky-machine",
  "state": "replacing",
  "region": "cdg",
  "instance\_id": "01G2TB62EWXMF8XNV6H3HR6B7G",
  "private\_ip": "fdaa:0:3ec2:a7b:5b66:45f8:8d7e:2",
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
  "created\_at": "2022-05-11T19:57:54Z",
  "events": [
    {
      "type": "update",
      "status": "replacing",
      "source": "user",
      "timestamp": 1652299077507
    },
    {
      "type": "start",
      "status": "started",
      "source": "flyd",
      "timestamp": 1652299074977
    },
    {
      "type": "launch",
      "status": "created",
      "source": "user",
      "timestamp": 1652299074034
    }
  ]
}
```