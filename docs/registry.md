---
id: registry
title: Registry
sidebar_label: Registry
---

## Identity Verification

Anyone can deploy their own document store, therefore it is not sufficient to check the document store name on the smart contract to ensure the identity of an issuer.

To ensure that certificates are issued by the right identity, OpenAttestation provides a solution based on [DNS-TXT records](https://openattestation.com/docs/advanced/identity-proofs).

Additionally, OpenCerts provides a [registry](https://opencerts.io/static/registry.json) to associate the identity of a contract store owner to that of a physical legal entity.

**An OpenCerts certificate will have its identity verified if at least one of the following condition is respected:**

- the issuer identity is registered in the registry.
- the issuer has a valid DNS-TXT record associated to its document store.

> In the event none of the condition above are fulfilled, the certificate will be declared from coming from an unknown source and thus it wont be declared as valid

## Application to SkillsFuture Singapore

The registry is maintained by SkillsFuture Singapore and serve to provide accreditation to institutes. Certificates issued by institutes in this registry will show Certificate issuer is in the SkillsFuture Singapore registry for OpenCerts in their verification status. Please note that we will not be accepting requests to join the OpenCerts registry at the moment.

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

> We **strongly** encourage you to use identity proof in your documents. However, if for any reason you don't want to use it, you can use [this deprecated CLI](https://github.com/OpenCerts/certificate-cli) which does not check for the presence of the identity proof
