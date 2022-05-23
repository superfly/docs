```
curl -i -X POST \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/user-functions/machines/73d8d46dbee589" \\
  -d '{
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