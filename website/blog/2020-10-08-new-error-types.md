---
title: New error types for better error handling
author: Jia Jian Goi
authorURL: https://www.linkedin.com/in/jiajian/
authorImageURL: https://lh3.googleusercontent.com/ogw/ADGmqu_9HzINF5cbSsYkYuo-PztvTbj6_xHJm_sGRKVH=s192-c-mo
---

A good part of software engineering [is to handle errors](https://medium.com/swlh/getting-error-handling-right-9a1d39da0fa3) that arise from your application. At GovTech, we understand the importance of having good error handling practices too.

In this post, we detail some of our recent upgrades to the [`oa-verify`](https://github.com/Open-Attestation/oa-verify/pull/110) library that improves the error handling coverage.

### Introduction

As the adoption of OpenCerts increases over time, we realise that the number of errors that we see are becoming much more complex.

For example,

- Infura and Cloudflare would rate-limit you if you try to spam them through our verifier, and thus returns a HTTP 429 Too Many Requests error
- Cloudflare's Ethereum Gateway would [randomly return](https://community.cloudflare.com/t/ethereum-gateway-random-502-error/195144) a HTTP 502 Bad Gateway error
- Users will try to _tamper_ with their certificate, just for the fun of it or to test our OpenCerts verifier 😉

### New errors

From `oa-verify` version `4.1.0`, we introduced the handling of these few errors.

