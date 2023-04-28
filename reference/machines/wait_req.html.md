```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/user-functions/machines/73d8d46dbee589/wait?instance_id=01GXPEEEOF95AYV5J1HYLGZ8P1&state=stopped"

```
**Status: 200**