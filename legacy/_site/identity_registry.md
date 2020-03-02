# Identity Registry

To associate the identity of a contract store owner to that of a physical legal entity, we maintain the records in a registry.

The registry currently a flat .json file located at [https://opencerts.io/static/registry.json](https://opencerts.io/static/registry.json)

## Application to SkillsFuture Singapore

The registry is maintained by [SkillsFuture Singapore](https://www.skillsfuture.sg/) and serve to provide accreditation to institutes. Certificates issued by institutes in this registry will show `Certificate issuer is in the SkillsFuture Singapore registry for Opencerts` in their verification status. To apply for your institute to be listed in the registry, kindly fill in [this form](https://form.gov.sg/5cd5141c02d207001007e322).

## Identity Verification

Anyone can deploy their own document store, therefore it is not sufficient to check the document store name on the smart contract.

To ensure that certificates are issued by the right identity, we conduct additional check on the owner of the document store. This is done by checking against the registry file and on the [DNS records](./dns_verification.md). One of the verification must be valid in order to be able to display a certificate in OpenCerts.

## Adding Records to the Identity Registry

1. Checkout the code at [OpenCerts Website](https://github.com/OpenCerts/opencerts-website).

2. Create a new record in the registry file at `static/registry.json`.

3. Make a PR to our repository.
