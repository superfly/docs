```sh
curl -i -X POST \
    -H "Authorization: Bearer ${FLY_API_TOKEN}" \
    -H "Content-Type: application/json" \
    "http://${FLY_API_HOSTNAME}/v1/apps/user-functions/machines/d5683210c7968e/start"
```

**Status: 200**

```json
{
  "previous_state": "stopped"
}
```
