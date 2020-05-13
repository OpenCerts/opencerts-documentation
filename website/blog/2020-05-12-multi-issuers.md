---
title: Multi issuers and deploy verify API
author: Laurent Maillet
authorURL: https://twitter.com/Nebounet
authorImageURL: https://lh3.googleusercontent.com/-kb0aLUOV4ek/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nAdhdRMUzxqvrX-aSDCkiILApv-pQ.CMID/s192-c/photo.jpg
---

## Documentation organisation

As part of our efforts to ease the adoption of OpenCerts, we have worked on several items for the past weeks.

### Multi issuers

While having multiple issuers has always been available in OpenCerts, there has been no documentation on this feature, as well how it differs from single issuer documents. The use cases might be rare (for instance when there is a collaboration between multiple universities), but now [we got you covered](/docs/multi-issuer).

### Deploy verify API

We have been providing an [API to verify OpenCerts document](https://github.com/OpenCerts/opencerts-functions) for quite awhile, however we don't provide support or SLA for it. This resulted in people copying and pasting the code and then deploying it into their own infrastructure.

The repository already contained scripts to automatically deploy to different infrastructure, but there was another complication. The repository contains multiple functions and while you might be interested by the API to verify documents, you might not be interested in the other APIs.

We have worked on that and improved it:

- every API is independently deployable (including verify API)
- the process is [documented](/docs/api/verify#deployment)

### Migration from v1 to v2

When revamping the documentation, we missed the article that covered the migration from v1 to v2. We fixed that problem, and [the documentation is available again](/docs/migrations/v1_to_v2)

> For any feedback, feel free to reach us out on [Github](https://github.com/OpenCerts) or on [Spectrum](https://spectrum.chat/openattestation/opencerts?tab=posts)
