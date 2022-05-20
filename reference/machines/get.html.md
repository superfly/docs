```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/user-functions/machines/d5683210c7968e" 

```
**Status: 200**
```json
{
  "id": "d5683210c7968e",
  "name": "quirky-machine",
  "state": "stopped",
  "region": "cdg",
  "instance\_id": "01G3GNA72484XS5D9SCRW8X79Q",
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
    "services": [
      {
        "internal\_port": 8080,
        "ports": [
          {
            "handlers": [
              "tls",
              "http"
            ],
            "port": 443
          },
          {
            "handlers": [
              "http"
            ],
            "port": 80
          }
        ],
        "protocol": "tcp"
      }
    ],
    "guest": {
      "cpu\_kind": "shared",
      "cpus": 1,
      "memory\_mb": 256
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
  "created\_at": "2022-05-20T11:58:13Z",
  "events": [
    {
      "type": "exit",
      "status": "stopped",
      "request": {
        "exit\_event": {
          "exit\_code": 127,
          "exited\_at": 1653047897299,
          "guest\_exit\_code": 0,
          "guest\_signal": -1,
          "oom\_killed": false,
          "requested\_stop": false,
          "restarting": false,
          "signal": -1
        },
        "restart\_count": 0
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