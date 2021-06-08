---
id: verifier
title: Verifier
sidebar_label: Verifier
---

## Identity Verification

Anyone can deploy their own document store, therefore it is not sufficient to check the document store name on the smart contract to ensure the identity of an issuer.

To ensure that certificates are issued by the right identity, OpenAttestation provides a solution based on [DNS-TXT records](https://openattestation.com/docs/advanced/identity-proofs).

Additionally, OpenCerts provides a [registry](https://opencerts.io/static/registry.json) to associate the identity of a contract store owner to that of a physical legal entity.

**An OpenCerts certificate will have its identity verified if at least one of the following condition is respected:**

- the issuer identity is registered in the registry.
- the issuer has a valid DNS-TXT record associated to its document store.

> In the event none of the condition above are fulfilled, the certificate will be declared from coming from an unknown source and thus it wont be declared as valid.<br><br>Please note that we will not be accepting requests to join the OpenCerts registry at the moment.

## OpenCerts vs OpenAttestation

As explained above OpenCerts checks that your identity is valid against the registry OR against the DNS records (you need at least one to be valid). However if you use the OpenAttestation CLI to create an OpenCerts document without providing `identityProof` (required for DNS records), you will face an error:

```bash
❯  ./open-attestation-linux wrap raw-documents wrapped-documents --schema https://schema.opencerts.io/transcripts/2.0
✖  error     Document /path/to/cli/raw-documents/opencerts.json is not valid against open-attestation schema
...
✖  error     The required property "issuers[0].identityProof" is missing
...
ℹ  info      You can enable logging by adding DEBUG=open-attestation-cli:* to your command
ℹ  info      More info on debug: https://www.npmjs.com/package/debug
```

> We **strongly** encourage you to use identity proof in your documents. However, if for any reason you don't want to use it, you can use [this deprecated CLI](https://github.com/OpenCerts/certificate-cli) which does not check for the presence of the identity proof.

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

> Please note that we will not be accepting requests to join the OpenCerts registry at the moment.
