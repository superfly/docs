```
curl -i -X POST \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/my-awesome-machine-app/machines/d5683212a7918e" \\
  -d '{
      "region": "ord",
      "config": {
        "image": "flyio/fastify-functions",
        "guest": {
          "memory\_mb": 512,
          "cpus": 2
        }
      }
    }'

```
**Status: 200**
```json
{
  "id": "d5683212a7918e",
  "name": "quirky-machine",
  "state": "starting",
  "region": "cdg",
  "instance\_id": "01G3F5JQ6R0X5XPM8VFGW9ETVM",
  "private\_ip": "fdaa:0:3ec2:a7b:5bd4:9fa:e7b7:2",
  "config": {
    "env": null,
    "init": {
      "exec": null,
      "entrypoint": null,
      "cmd": null,
      "tty": false
    },
    "image": "flyio/fastify-functions",
    "metadata": null,
    "restart": {
      "policy": ""
    },
    "guest": {
      "cpu\_kind": "",
      "cpus": 2,
      "memory\_mb": 512
    }
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
```