```json
{
  "id": "24d896dec64879",
  "name": "machine-syd",
  "state": "starting",
  "region": "syd",
  "instance_id": "01G3SHQRYPVPZ8K8G0VQK42819",
  "private_ip": "fdaa:0:3ec2:a7b:8566:9b25:46d8:2",
  "config": {
    "env": {
      "APP_ENV": "production"
    },
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
    "services": [
      {
        "internal_port": 8080,
        "ports": [
          {
            "handlers": ["tls", "http"],
            "port": 443
          },
          {
            "handlers": ["http"],
            "port": 80
          }
        ],
        "protocol": "tcp"
      }
    ],
    "guest": {
      "cpu_kind": "shared",
      "cpus": 1,
      "memory_mb": 256
    }
  },
  "image_ref": {
    "registry": "registry-1.docker.io",
    "repository": "flyio/fastify-functions",
    "tag": "latest",
    "digest": "sha256:e15c11a07e1abbc50e252ac392a908140b199190ab08963b3b5dffc2e813d1e8",
    "labels": {}
  },
  "created_at": "2022-05-23T22:48:52Z"
}
```
