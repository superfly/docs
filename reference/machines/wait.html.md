```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/my-awesome-machine-app/machines/24d899e0b33879/wait" 

```
**Status: 200**
```json
{
  "ok": true
}
```