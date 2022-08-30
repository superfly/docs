The quickest way to connect to your deployed app is with the `flyctl open` command. This will open a browser on the http version of the site. That will automatically be upgraded to a https secured connection (when using the fly.dev domain) to connect to it securely. Add `/name` to `flyctl open` and it'll be appended to the apps path and you'll get an extra greeting from the hellofly application.

```cmd
flyctl open /fred
```
```out
Opening http://hellofly.fly.dev/fred
```

<img src="/docs/hands-on/images/helloflyandfred.png" alt="Hello from Fly Screenshot" class="rounded-xl shadow-lg">

You have successfully deployed and visited your first Fly application.

