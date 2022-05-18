```
curl -i -X POST \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/${FLY\_APP\_NAME}/machines/217814d4f3d896/start" 

```
**Status: 200**
```json
{
  "previous\_state": "stopped"
}
```