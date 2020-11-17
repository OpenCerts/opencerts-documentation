---
title: Transcript v2.1
author: Laurent Maillet
authorURL: https://twitter.com/Nebounet
authorImageURL: https://lh3.googleusercontent.com/-kb0aLUOV4ek/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nAdhdRMUzxqvrX-aSDCkiILApv-pQ.CMID/s192-c/photo.jpg
---

### Transcript v2.1

We added support for skills in [the latest version of OpenCerts transcripts schema](https://schema.opencerts.io/transcripts/2.1). The skills will enrich your OpenCerts using the definition provided by [WSG skills framework](https://www.skillsfuture.sg/skills-framework). A skill looks like:

```json
{
  "frameworkUri": "https://www.skillsfuture.sg/skills-framework",
  "frameworkVersion": "1.0",
  "frameworkName": "SFw",
  "sector": "Air Transport",
  "category": "Aircraft Operations",
  "competencyCode": "ATP-ACO-4001-1.1",
  "competencyDescription": "Monitor aircraft systems, performance and external environments as well as comply with Air Traffic Control (ATC) instructions and en route navigation requirements to ensure safe and optimal flight conditions",
  "competencyLevel": "Level 4",
  "competencyLevelDescription": "Analyse aircraft performance through close monitoring of flight decks to ensure optimal flight conditions during cruise"
}
```

You can add as many skills as needed. You can find a [full example here](https://raw.githubusercontent.com/OpenCerts/open-certificate/master/schema/2.1/example.json)

### Registry page

We have redesigned the [OpenCerts registry page](https://dev.opencerts.io/registry). Information of registry are collated by institution (some institution may own multiplie document store). If you need to contact an institution about your OpenCerts you can click on the details or search using the document store from your certificate.

![Registry page](/img/docs/blog/2020-11-17/registry_page.png)

### Migration legacy to new renderer

In order to help more institution to adopt the decentralized architecture of OpenCerts v2, we have created a [guide](/docs/migrations/migrate_renderer) to help early adopter to migrate from the legacy render to the decentralized renderer.
