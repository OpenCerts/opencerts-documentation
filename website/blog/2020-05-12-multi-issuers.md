---
title: Multi issuers and deploy verify API
author: Laurent Maillet
authorURL: https://twitter.com/Nebounet
authorImageURL: https://lh3.googleusercontent.com/-kb0aLUOV4ek/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nAdhdRMUzxqvrX-aSDCkiILApv-pQ.CMID/s192-c/photo.jpg
---

## Documentation organisation

As part of our effort to ease the adoption of OpenCerts, we have worked on several items for the past weeks.

### Multi issuers

While having multiple issuers had always been available in OpenCerts, there were no explanation on how to do it, and the differences with having one issuer only. The use cases might be rare (for instance when there is a collaboration between multiple universities), but now [we got you covered](/docs/multi-issuer).

### Deploy verify API

We have been provided an [API to verify OpenCerts document](https://github.com/OpenCerts/opencerts-functions) for quite a while, however we don't provide support or SLA for it. This led people to had to copy / paste the code and then deploy it into their own infrastructure.

The code already provided scripts to automatically deploy to different infrastructure, but there were another problem. The repository is composed of multiple functions and while you might be interested by the API to verify document, you might not have been interested by the other APIs.

We have worked on that and improved it:

- every API is single-handedly deployable (including verify API)
- the process is [documented](/docs/api/verify#deployment)

### Migration from v1 to v2

When revamping the documentation, we forgot to bring back the one that covers the migration from v1 to v2 documentation. We fixed that problem, and [the documentation is available again](/docs/migrations/v1_to_v2)

> For any feedback, feel free to reach us out on [Github](https://github.com/OpenCerts) or on [Spectrum](https://spectrum.chat/openattestation/opencerts?tab=posts)
