```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/my-awesome-machine-app" 

```
**Status: 200**
```json
{
  "name": "my-awesome-machine-app",
  "organization": {
    "name": "My Org",
    "slug": "personal"
  }
}
```