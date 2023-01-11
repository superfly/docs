```sh
curl -i -X DELETE \
    -H "Authorization: Bearer ${FLY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "http://${FLY_API_HOSTNAME}/v1/apps/user-functions/machines/d5683210c7968e"
```

**Status: 200**

```json
{
  "ok": true
}
```
