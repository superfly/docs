```
curl -i -X DELETE \\
    -H "Authorization: Bearer ${FLY\_API\_TOKEN}" -H "Content-Type: application/json" \\
    "${FLY\_API\_HOSTNAME}/v1/apps/user-functions/machines/24d896dec64879" 
```

Optionally append `?force=true` to the URI to kill a running machine.

**Status: 200**
