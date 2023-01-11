```sh
curl -i -X POST \
    -H "Authorization: Bearer ${FLY_API_TOKEN}" -H "Content-Type: application/json" \
    "http://${FLY_API_HOSTNAME}/v1/apps" \
  -d '{
      "app_name": "user-functions",
      "org_slug": "personal"
    }'
```

**Status: 201**
