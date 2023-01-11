```sh
curl -i -X GET \
    -H "Authorization: Bearer ${FLY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "http://${FLY_API_HOSTNAME}/v1/apps/user-functions/machines/d5683210c7968e"
```

**Status: 200**

```json
{
  "id": "d5683210c7968e",
  "name": "quirky-machine",
  "state": "stopped",
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
  "created_at": "2022-05-20T11:58:13Z",
  "events": [
    {
      "type": "exit",
      "status": "stopped",
      "request": {
        "exit_event": {
          "exit_code": 127,
          "exited_at": 1653047897299,
          "guest_exit_code": 0,
          "guest_signal": -1,
          "oom_killed": false,
          "requested_stop": false,
          "restarting": false,
          "signal": -1
        },
        "restart_count": 0
      },
      "source": "flyd",
      "timestamp": 1653047898717
    },
    {
      "type": "update",
      "status": "replacing",
      "source": "user",
      "timestamp": 1653047897200
    },
    {
      "type": "start",
      "status": "started",
      "source": "flyd",
      "timestamp": 1653047895247
    },
    {
      "type": "launch",
      "status": "created",
      "source": "user",
      "timestamp": 1653047893083
    }
  ]
}
```
