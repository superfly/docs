```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/${FLY\_APP\_NAME}/machines/24d899e6c93879/wait" 

```
**Status: 200**
```json
{
  "ok": true
}
```