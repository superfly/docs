```
curl -i -X POST \
    -H "Authorization: Bearer ${FLY_API_TOKEN}" -H "Content-Type: application/json" \
    "http://${FLY_API_HOSTNAME}/v1/apps/user-functions/machines/3d8d413b29d089/lease" \
    -d '{
        "ttl": 500
    }'
```
* `ttl` (optional) how long the lease should be held for