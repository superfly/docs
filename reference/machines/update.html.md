```
curl -i -X POST \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/user-functions/machines/d5683210c7968e" \\
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
  "id": "d5683210c7968e",
  "name": "quirky-machine",
  "state": "starting",
  "region": "cdg",
  "instance\_id": "01G3GNAB3FY1FX7P5723XCHKT0",
  "private\_ip": "fdaa:0:3ec2:a7b:5adc:c12d:84b0:2",
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
  "created\_at": "2022-05-20T11:58:13Z"
}
```