```
curl -i -X POST \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps" \\
  -d '{
      "app\_name": "my-awesome-machine-app",
      "org\_slug": "personal"
    }'

```
**Status: 201**