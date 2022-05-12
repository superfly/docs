```
curl -i -X POST \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/my-awesome-machine-app/machines/d5683219b298e9" \\
  -d '{
      "region": "ord",
      "config": {
        "image": "nginx",
        "guest": {
          "memory\_mb": 512,
          "cpu\_kind": "shared",
          "cpus": 2
        }
      }
    }'

```
**Status: 200**
```json
{
  "id": "d5683219b298e9",
  "name": "quirky-machine",
  "state": "starting",
  "region": "cdg",
  "instance\_id": "01G2WTWDJXKMQTSAKAGG3DGA0N",
  "private\_ip": "fdaa:0:3ec2:a7b:5b66:4abb:590f:2",
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
  "created\_at": "2022-05-12T19:10:39Z"
}
```