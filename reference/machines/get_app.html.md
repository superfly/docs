```
curl -i -X GET \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "http://${FLY\_API\_HOSTNAME}/v1/apps/${FLY\_APP\_NAME}" 

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