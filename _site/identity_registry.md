# Identity Registry

To associate the identity of a contract store owner to that of a physical legal entity, we maintain the records in a registry.

The registry currently a flat .json file located at [https://opencerts.io/static/registry.json](https://opencerts.io/static/registry.json)

## Identity Verification

Anyone can deploy their own certificate store, therefore it is not suffcient to check the certificate store name on the smart contract. 

To ensure that certificates are issued by the right identity, we conduct additional check on the owner of the certificate store. This is done by checking against the flat file.

![Unregistered Institution Warning](./assets/identity-registry/unregistered-institute-warning.png)

Should identity verification failed, a warning will be presented to the viewer. This warning simply means that the identity of the issuer cannot be verified and should be verified through other means. For example, the issuer may publish their certificate store address on their website for viewers of their certificates to check against.

## Adding Records to the Identity Registry

1. Checkout the code at [OpenCerts Website](https://github.com/OpenCerts/opencerts-website). 

2. Create a new record in the registry file at `static/registry.json`.

3. Make a PR to our repository. 

## A Work in Progress

The team behind OpenCerts believe that associating identities in a decentralised world is a work-in-progress. We are actively seeking to find a balance between decentralisation and providing trusted content for our user.

If you have suggestions on how to do it better, do let us know by opening an issue or [join us](https://ethernaut.gdshive.io/)!
