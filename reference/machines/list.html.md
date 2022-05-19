```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/my-awesome-machine-app/machines" 

```
**Status: 200**
```json
[
  {
    "id": "d5683212a7918e",
    "name": "quirky-machine",
    "state": "started",
    "region": "cdg",
    "instance\_id": "01G3F5JJX3F2NR83VAQXSEHHFT",
    "private\_ip": "fdaa:0:3ec2:a7b:5bd4:9fa:e7b7:2",
    "config": {
      "env": null,
      "init": {
        "exec": null,
        "entrypoint": null,
        "cmd": null,
        "tty": false
      },
      "image": "flyio/fastify-functions:latest",
      "metadata": {
      },
      "restart": {
        "policy": "",
        "max\_retries": 3
      },
      "size": "shared-cpu-1x"
    },
    "image\_ref": {
      "registry": "registry-1.docker.io",
      "repository": "flyio/fastify-functions",
      "tag": "latest",
      "digest": "sha256:e15c11a07e1abbc50e252ac392a908140b199190ab08963b3b5dffc2e813d1e8",
      "labels": {
      }
    },
    "created\_at": "2022-05-19T22:03:55Z"
  }
]
```