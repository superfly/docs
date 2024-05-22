---
title: Cargo Chef
layout: framework_docs
objective: Cargo Chef is a cargo extension that is commonly used in Dockerfiles for Rust apps. 
order: 1
---

We model the Dockerfile for Rust projects after the cargo chef project. The reason for that is that the build images are very small and the builds are quick after the initial build.

The image template looks something like this:

```dockerfile
FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder 
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY . .
RUN cargo build --release --bin [rust-app]

# We do not need the Rust toolchain to run the binary!
FROM debian:bookworm-slim AS runtime
WORKDIR /app
COPY --from=builder /app/target/release/[rust-app] /usr/local/bin
ENTRYPOINT ["/usr/local/bin/[rust-app]"] 
```

You can read more about cargo chef on the [GitHub Repository](https://github.com/LukeMathWalker/cargo-chef+external).