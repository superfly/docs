---
title: "Setting Vite Environment Variables"
layout: framework_docs
objective: How to set up your Dockerfile to build assets that require Vite environment variable values.
order: 6
---
Recent Laravel framework versions [make use of Vite](https://laravel.com/docs/11.x/vite) to bundle CSS and JavaScript files for production use.

Vite makes use of the [dotenv module](https://vitejs.dev/guide/env-and-mode#env-files) to load environment variables during asset bundling. It [exposes proper](https://laravel.com/docs/11.x/broadcasting#client-pusher-channels) environment variables from [specific .env files](https://vitejs.dev/guide/env-and-mode.html#env-files). Coincidentally however, we [_don't_ include](https://github.com/fly-apps/dockerfile-laravel/blob/e7e7285698aaedf3cde77470c38b65de0f34af77/resources/views/fly/dockerignore.blade.php#L11) .env files for Laravel apps deployed in Fly.io.

Of course, given you have a Laravel application using Vite that uses important-secret-env variables, how do you set that up at Fly.io? For example, let's say, we have this JavaScript file that sets up [Laravel Echo](https://laravel.com/docs/11.x/broadcasting#client-pusher-channels) in the client to connect to our Laravel app's [Pusher Channel driver](https://laravel.com/docs/11.x/broadcasting#pusher-channels):

```javascript
/* resources/js/echo.js */
import Echo from 'laravel-echo';
 
import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});
```
Notice it makes use of two environment variables, `VITE_PUSHER_APP_KEY` and `VITE_PUSHER_APP_CLUSTER` imported from `meta.env`.

Again, Vite, reads its environment variables from the proper .env file, which for Laravel apps, we don't include when deploying at Fly.io. Because of this, those environment variables would be returned as `undefined` in your Laravel app deployed at Fly.io.

A common error you'll probably see from your console because of this is: 
```error
You must pass your app key when you instantiate Pusher.
```

## Solution: Build Secrets + Dockerfile Setup
Now, don't fear. This page tackles exactly how to fix this issue.

All we actually need to do is ask our Dockerfile to create a `.env.production` file on the go using [build secrets](https://fly.io/docs/reference/build-secrets/) we pass during `flyctl deploy`. Take note! This `.env.production` file needs to be created before bundling your assets take place! 

So, in the Dockerfile of your Laravel application, _before_ [building your assets](https://github.com/fly-apps/dockerfile-laravel/blob/e7e7285698aaedf3cde77470c38b65de0f34af77/resources/views/dockerfile.blade.php#L55), add the env variables you need by extracting them from the [build secrets you mount](https://fly.io/docs/reference/build-secrets/#mounting-secrets), then writing them to a `.env.production` file:

```Dockerfile
# Mount secrets, and create a temporary .env.production which is needed when building the assets for vite
# Please RUN this before building your assets for vite!
RUN --mount=type=secret,id=VITE_APP_NAME \
    --mount=type=secret,id=VITE_PUSHER_APP_SECRET \
    --mount=type=secret,id=VITE_PUSHER_APP_KEY \
    --mount=type=secret,id=VITE_PUSHER_APP_CLUSTER \
    echo "VITE_APP_NAME=$(cat /run/secrets/VITE_APP_NAME)" >> .env.production && \ 
    echo "VITE_PUSHER_APP_KEY=$(cat /run/secrets/VITE_PUSHER_APP_KEY)" >> .env.production && \
    echo "VITE_PUSHER_APP_SECRET=$(cat /run/secrets/VITE_PUSHER_APP_SECRET)" >> .env.production && \
    echo "VITE_PUSHER_APP_CLUSTER=$(cat /run/secrets/VITE_PUSHER_APP_CLUSTER)" >> .env.production 
```

Finally make sure that you [include these build secrets](https://fly.io/docs/reference/build-secrets/#secret-values) every time you deploy your app with `fly deploy`:

```
fly deploy \
    --build-secret VITE_APP_NAME="Laravel" \
    --build-secret VITE_PUSHER_APP_KEY="my-key" \
    --build-secret VITE_PUSHER_APP_SECRET="my-secret" \
    --build-secret VITE_PUSHER_APP_CLUSTER="my-cluster" 
```

And that's it! You're assets should now be bundled with your environment variable values!