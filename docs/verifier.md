---
id: verifier
title: Verifier
sidebar_label: Verifier
---

> Feel free to reach [OpenAttestation verifier documentation](https://openattestation.com/docs/component/oa-verify) at any time to understand more about this component. 

As we discussed in the previous section, the identity of an OpenCerts is verified through:
1. [OpenCerts registry](/docs/registry)
1. [DNS-TXT records](https://openattestation.com/docs/extension/identity-proofs)

However, OpenCerts registry is not compliant with OpenAttestation standards. It's a specific way, used by OpenCerts, to verify the identity of a certificate. Even if we **strongly** encourage people to use DNS-TXT records, it's not mandatory. The consequence is that a certificate may be identified **only** thanks to the registry.

In order to support those certificates and to verify the identity of issuers, a custom verifier is needed. Indeed, using OpenAttestation verifier on OpenCerts document without `identityProof` will result in an error for the `ISSUER_IDENTITY` type.

[OpenCerts verify library](https://github.com/OpenCerts/verify) has been built to handle this problem.

## Differences with @govtechsg/oa-verify

### OpencertsRegistryVerifier
`OpencertsRegistryVerifier` is a new verification method:
- it ensures document `ISSUER_IDENTITY` and works closely with `OpenAttestationDnsTxt` verifier (see [below](#isvalid))
- it returns a `VALID` fragment if at least one of the issuer is in OpenCerts registry
- it returns a `SKIPPED` fragment if none of the issuers is in the registry.

### isValid
With the addition of `OpencertsRegistryVerifier` verification method, different rules apply for `ISSUER_IDENTITY` type fragments:

- `ISSUER_IDENTITY` is valid if at least one issuer is in the registry, i.e. if `OpencertsRegistryVerifier` has status `VALID`
- if `OpencertsRegistryVerifier` doesn't have `VALID` status then all issuers must have valid `DNS-TXT` record.
