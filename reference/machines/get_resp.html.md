
```json
{
  "id": "73d8d46dbee589",
  "name": "quirky-machine",
  "state": "stopped",
  "region": "cdg",
  "instance\_id": "01G3SHPT434MNW8TS4ENX11RQY",
  "private\_ip": "fdaa:0:3ec2:a7b:5adc:6068:5b85:2",
  "config": {
    "env": {
      "APP\_ENV": "production"
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
  "created\_at": "2022-05-23T22:48:21Z",
  "events": [
    {
      "type": "exit",
      "status": "stopped",
      "request": {
        "exit\_event": {
          "exit\_code": 127,
          "exited\_at": 1653346105255,
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
      "timestamp": 1653346106636
    },
    {
      "type": "update",
      "status": "replacing",
      "source": "user",
      "timestamp": 1653346105801
    },
    {
      "type": "start",
      "status": "started",
      "source": "flyd",
      "timestamp": 1653346103201
    },
    {
      "type": "launch",
      "status": "created",
      "source": "user",
      "timestamp": 1653346101403
    }
  ]
}
```