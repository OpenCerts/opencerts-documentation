---
title: New error types for better error handling
author: Jia Jian Goi
authorURL: https://www.linkedin.com/in/jiajian/
authorImageURL: https://lh3.googleusercontent.com/ogw/ADGmqu_9HzINF5cbSsYkYuo-PztvTbj6_xHJm_sGRKVH=s192-c-mo
---

A good part of software engineering [is to handle errors](https://medium.com/swlh/getting-error-handling-right-9a1d39da0fa3) that arise from your application. At GovTech, we understand the importance of having good error handling practices too.

In this post, we detail some of our recent upgrades to the [`opencerts-verify`](https://github.com/OpenCerts/verify/pull/10) library that improves the error handling coverage when attempting to verify OpenCerts or OpenAttestation documents.

### Introduction

In the past, `opencerts-verify` could only handle just a few types of errors. With the increasing usage of OpenCerts in recent months due to the Covid-19 pandemic, we've seen a wide variety of interesting and funky errors.

For example,

- Infura and Cloudflare would rate-limit you if you try to spam them through our verifier, and thus returns a HTTP 429 Too Many Requests error
- Cloudflare's Ethereum Gateway would [randomly return](https://community.cloudflare.com/t/ethereum-gateway-random-502-error/195144) a HTTP 502 Bad Gateway error
- Users will try to _tamper_ with their certificate, just for the fun of it or to test our OpenCerts verifier 😉

For the first two scenarios, our OpenCerts verifier would previously show that the certificate is invalid. That's because we didn't handle HTTP errors in `opencerts-verify`.

For the last scenario, our OpenCerts verifier didn't handle those cases properly and instead, our opencerts.io frontend verifier will say that it's **(a)** not issued and **(b)** revoked at the same time. While such a case can happen, it clearly doesn't reflect the actual error — that is, the user probably tampered with the certificate's `merkleRoot`. I'll describe more later in the [Invalid Argument](#invalid-argument) section.

### New errors

From `opencerts-verify` version `2.2.0`, we introduced the handling of these few errors and they are:

- `SERVER_ERROR`
- `INVALID_ARGUMENT`

#### `SERVER_ERROR`

This error encompasses Ethers's `{ "bad response", "failed response", "missing response" }`.

To recap,

> A `4xx` code indicates an error caused by the user, whereas `5xx` codes tell the client that they did everything correctly and it's the server itself who caused the problem.

Generally, Ethers classify both `4xx` and `5xx` errors as `bad response`.

(For those who're interested in how Ethers handle HTTP-related errors internally, you might want to take a look at [this](https://github.com/ethers-io/ethers.js/blob/9640e864a68b4a9e84e820f0ceaf1eb56c66715f/packages/web/src.ts/index.ts).)

Instead of checking for Ethers _error messages_ (e.g. bad response, missing response, etc.), we now group them using Ethers _error codes_ (e.g. `SERVER_ERROR`) wherever possible — because there are just too many different error messages to handle.

Do note that error messages are NOT the same as error codes, you can think of error codes as an umbrella term for many error messages.

As for our decision to group both **(a)** user errors and **(b)** server errors together, that's because we don't need to have a finer level of granularity at this moment (i.e. we don't need to know that it's `4xx` vs `5xx`).

#### `INVALID_ARGUMENT`

As the name suggests, the `INVALID_ARGUMENT` error means the input argument is invalid. In this case, we're referring to the merkle root.

Because our verifier uses the document's `merkleRoot` to check against what's stored on the Ethereum blockchain, there were cases where users have tried to mess with their certificate.

Below are three examples of invalid `merkleRoot`s:

- `61dc9186345e05cc2ae53dc72af880a3b66e2fa7983feaa6254d1518540de5` is even length, but is not 64 characters (or 32 bytes) as required of merkle roots - Ethers returns error message `incorrect data length`
- `61dc9186345e05cc2ae53dc72af880a3b66e2fa7983feaa6254d1518540de50` is not of a valid length - Ethers returns error message `hex is of odd-length`

- `61dc9186345e05cc2ae53dc72af880a3b66e2fa7983feaa6254d1518540de50Z` is of valid length, BUT contains an invalid character (the `Z`) - Ethers returns error message `invalid hex string`

All three examples above are classified as `INVALID_ARGUMENT` from `opencerts-verify` version `2.2.0`.

For good measure, `61dc9186345e05cc2ae53dc72af880a3b66e2fa7983feaa6254d1518540de50a` is OK, leaving this here for an example of a valid `merkleRoot` to provide context for the three errors above.

### Further discussion

That's all for now!

> For any feedback, feel free to reach us out on [GitHub](https://github.com/OpenCerts).
