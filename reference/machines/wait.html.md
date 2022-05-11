```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/my-awesome-machine-app/machines/73d8d463c49891/wait" 

```
**Status: 200**
```json
{
  "ok": true
}
```