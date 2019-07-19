# OpenCerts Documentation

[![Gitter](https://badges.gitter.im/OpenCerts/community.svg)](https://gitter.im/OpenCerts/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Now on [https://docs.opencerts.io](https://docs.opencerts.io)

## Run locally

We use jekyll to run a local copy of the site.

```bash
bundle exec jekyll serve
```

## Update search index

```bash
ALGOLIA_API_KEY='your_admin_api_key' bundle exec jekyll algolia
```
