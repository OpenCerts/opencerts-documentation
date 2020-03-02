---
id: verify
title: Verify API
sidebar_label: Verify
---

> Please note that this API has only been created for tests and demo purpose and as such doesn't provide any guarantee for systems that want to use it in production (no SLA).

The purpose of this API is to provide a simple way to verify a document without any dependency. There is one API deployed for `mainnet` and one for `ropsten` :

- https://api.opencerts.io/verify
- https://api-ropsten.opencerts.io/verify

## Implementation   
The API is built using [OpenCerts verifier](/docs/verifier.md). It consists only to return the result returned by `verify` and `isValid` methods. The code is available in [Github](https://github.com/OpenCerts/opencerts-functions/blob/master/src/verify/index.js). 

## Usage

Only one endpoint is available, at the root of the API, using the `POST` method:

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"document":"<OA_DOCUMENT_HERE>"}' \
  https://api-ropsten.opencerts.io/verify
```

The response will look like:

- `summary` is an object containing the verification for each fragment types as well as the consolidated result.
  - `summary.all` is a boolean indicating whether the document is valid or not.
  - `summary.documentStatus` is a boolean indicating whether the document is valid for fragment with `DOCUMENT_STATUS` type.
  - `summary.documentIntegrity` is a boolean indicating whether the document is valid for fragment with `DOCUMENT_INTEGRITY` type.
  - `summary.issuerIdentity` is a boolean indicating whether the document is valid for fragment with `ISSUER_IDENTITY` type.
- data is an array containing the fragments returned by all the verifiers that ran over the provided document.

For example:

```json
{
  "summary": {
    "all": true,
    "documentStatus": true,
    "documentIntegrity": true,
    "issuerIdentity": true
  },
  "data": [
    {
      "type": "DOCUMENT_INTEGRITY",
      "name": "OpenAttestationHash",
      "data": true,
      "status": "VALID"
    },
    {
      "name": "OpenAttestationEthereumDocumentStoreIssued",
      "type": "DOCUMENT_STATUS",
      "data": {
        "issuedOnAll": true,
        "details": [
          {
            "address": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
            "issued": true
          }
        ]
      },
      "status": "VALID"
    },
    {
      "status": "SKIPPED",
      "type": "DOCUMENT_STATUS",
      "name": "OpenAttestationEthereumTokenRegistryMinted",
      "reason": {
        "code": 4,
        "codeString": "SKIPPED",
        "message": "Document issuers doesn't have \"tokenRegistry\" property or TOKEN_REGISTRY method"
      }
    },
    {
      "name": "OpenAttestationEthereumDocumentStoreRevoked",
      "type": "DOCUMENT_STATUS",
      "data": {
        "revokedOnAny": false,
        "details": [
          {
            "address": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
            "revoked": false
          }
        ]
      },
      "status": "VALID"
    },
    {
      "status": "SKIPPED",
      "type": "ISSUER_IDENTITY",
      "name": "OpenAttestationDnsTxt",
      "reason": {
        "code": 2,
        "codeString": "SKIPPED",
        "message": "Document issuers doesn't have \"documentStore\" / \"tokenRegistry\" property or doesn't use DNS-TXT type"
      }
    },
    {
      "type": "ISSUER_IDENTITY",
      "name": "OpencertsRegistryVerifier",
      "status": "VALID",
      "data": [
        {
          "status": "VALID",
          "value": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
          "name": "Government Technology Agency of Singapore (GovTech)",
          "displayCard": true,
          "website": "https://www.tech.gov.sg",
          "email": "info@tech.gov.sg",
          "phone": "+65 6211 2100",
          "logo": "/static/images/GOVTECH_logo.png",
          "id": "govtech-registry"
        }
      ]
    }
  ]
}
```
