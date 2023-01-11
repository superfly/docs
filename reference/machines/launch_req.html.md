```sh
curl -i -X POST \
    -H "Authorization: Bearer ${FLY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "http://${FLY_API_HOSTNAME}/v1/apps/user-functions/machines" \
    -d '{
      "name": "quirky-machine",
      "config": {
        "image": "flyio/fastify-functions",
        "env": {
          "APP_ENV": "production"
        },
        "services": [
          {
            "ports": [
              {
                "port": 443,
                "handlers": [
                  "tls",
                  "http"
                ]
              },
              {
                "port": 80,
                "handlers": [
                  "http"
                ]
              }
            ],
            "protocol": "tcp",
            "internal_port": 8080
          }
        ]
      }
    }'
```

**Status: 200**
