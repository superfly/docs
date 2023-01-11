```sh
curl -i -X DELETE \
    -H "Authorization: Bearer ${FLY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "http://${FLY_API_HOSTNAME}/v1/apps/user-functions"
```

**Status: 404**

```json
{
  "error": "Could not find App \"user-functions\""
}
```
