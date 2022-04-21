---
title: TLS Support
layout: docs
nav: firecracker
---

The Fly proxy only supports TLSv1.2 and TLSv1.3 with strong ciphers.

## Supported Cipher Suites

These suites give us broad, secure coverage. We do not support very old browsers.

```
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
TLS_CHACHA20_POLY1305_SHA256
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
```

You can always get an updated list of supported ciphers from [these test results](https://www.ssllabs.com/ssltest/analyze.html?d=fly.io&s=2a09%3a8280%3a1%3a0%3a0%3a0%3aa%3a791&hideResults=on&latest).
