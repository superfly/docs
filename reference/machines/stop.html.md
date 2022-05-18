```
curl -i -X POST \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/my-awesome-machine-app/machines/24d899e0b99879/stop" 

```
**Status: 409**
```json
{
  "error": "unable to stop machine, not currently started"
}
```