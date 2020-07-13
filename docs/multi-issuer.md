---
id: multi-issuer
title: Multi Issuers
sidebar_label: Multi Issuers
---

OpenCerts allows documents to have any number of issuers. This can be useful in some cases when there is a collaboration on a degree between multiple institutions (Double Degree).

> Please note that the current model is not compatible with W3C Verifiable Credentials (VC) which only allows **one** issuer per VC. We might revisit this use-case in the future.

## Workflow

![Workflow](/img/docs/multi-issuer/workflow.png)

The workflow is similar to the common use case:

- The document must contain multiple issuers in the `issuer` property:

```json
{
  "issuers": [
    {
      "name": "Govtech",
      "url": "https://tech.gov.sg",
      "documentStore": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "demo.openattestation.com"
      }
    },
    {
      "name": "University Of Blockchain",
      "url": "https://blockchain.univ.sg",
      "documentStore": "0xdcA6Eea7024151c270b50FcA9E67161119B06BAD",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "blockchain.univ.sg"
      }
    }
  ]
}
```

- One of the issuers must be responsible for wrapping the document.
- All issuers must issue the document (at any time).

> Note that issuers can decide to not issue or to revoke the document at any time, if they think that the document is not valid, for any reason.

## Statuses

Let's see how OpenCerts will behave for the different statuses checked, when using multiple issuers.

### Has the document been tampered ?

There is no change in behavior. The document must not be tampered in order to be valid.

### Has the document been issued ?

The document will be considered as issued if (and only if) it has been issued by **all** the issuers.

Meaning that if **at least one** issuer has not issued the document, then the document won't be considered as issued.

### Has the document been revoked ?

If **at least one** issuer has revoked the document, then the document will be considered as revoked.

This means that the document is considered not revoked as long as none of the issuers has revoked it.

### Is the identity of the issuers valid ?

The issuer identity will be valid for the document, if **at least** one of the following condition is fulfilled:

1. One of the issuer is in the [registry](/registry). Every issuer can be in the registry, but one is enough.
1. If no issuer is in the registry, then all issuers must have their identity verified, using any mechanism available from [OpenAttestation](https://openattestation.com/docs/advanced/identity-proofs).

In the event the above conditions are not fulfilled, then the issuers identity will not be valid.
