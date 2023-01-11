```sh
curl -i -X GET \
    -H "Authorization: Bearer ${FLY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "http://${FLY_API_HOSTNAME}/v1/apps/user-functions/machines"
```

**Status: 200**

```json
[
  {
    "id": "d5683210c7968e",
    "name": "quirky-machine",
    "state": "started",
    "region": "cdg",
    "instance_id": "01G3GNA72484XS5D9SCRW8X79Q",
    "private_ip": "fdaa:0:3ec2:a7b:5adc:c12d:84b0:2",
    "config": {
      "env": null,
      "init": {
        "exec": null,
        "entrypoint": null,
        "cmd": null,
        "tty": false
      },
      "image": "flyio/fastify-functions:latest",
      "metadata": {},
      "restart": {
        "policy": "",
        "max_retries": 3
      },
      "size": "shared-cpu-1x"
    },
    "image_ref": {
      "registry": "registry-1.docker.io",
      "repository": "flyio/fastify-functions",
      "tag": "latest",
      "digest": "sha256:e15c11a07e1abbc50e252ac392a908140b199190ab08963b3b5dffc2e813d1e8",
      "labels": {}
    },
    "created_at": "2022-05-20T11:58:13Z"
  }
]
```
