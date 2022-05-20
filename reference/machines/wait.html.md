```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/user-functions/machines/d5683210c7968e/wait" 

```
**Status: 200**
```json
{
  "ok": true
}
```