```sh
curl -i -X GET \
    -H "Authorization: Bearer ${FLY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "http://${FLY_API_HOSTNAME}/v1/apps/user-functions"
```

**Status: 200**

```json
{
  "name": "user-functions",
  "organization": {
    "name": "My Org",
    "slug": "personal"
  }
}
```
