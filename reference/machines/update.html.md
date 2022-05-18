```
curl -i -X POST \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/${FLY\_APP\_NAME}/machines/217814d4f3d896" \\
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
  "id": "217814d4f3d896",
  "name": "quirky-machine",
  "state": "starting",
  "region": "cdg",
  "instance\_id": "01G3BZ3BDSQ1NXC2045RZ5E96A",
  "private\_ip": "fdaa:0:3ec2:a7b:5bd4:35b7:f1ed:2",
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
  "created\_at": "2022-05-18T16:12:56Z"
}
```