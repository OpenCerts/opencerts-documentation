---
id: index
title: Getting Started
sidebar_label: Getting Started
---

OpenCerts, part of Singapore’s Smart Nation initiative, enables issuance and validation of tamper-resistant academic certificates in a convenient and reliable manner.

OpenCerts v3 is built on top of [TrustVC](https://github.com/TrustVC/trustvc), a comprehensive wrapper library for signing and verifying both [W3C Verifiable Credentials (VC)](https://www.w3.org/TR/vc-data-model/) and [OpenAttestation](https://www.openattestation.com) Verifiable Documents. This represents a significant upgrade from OpenCerts v2, which was built directly on OpenAttestation.

## What’s New in v3

- **W3C Verifiable Credentials**: Documents now follow the [W3C VC Data Model v2.0](https://www.w3.org/TR/vc-data-model/), improving interoperability with the global verifiable credentials ecosystem.
- **TrustVC Framework**: A unified library that supports both W3C VC and OpenAttestation documents, providing signing (`ecdsa-sd-2023`, `bbs-2023`), verification, and selective disclosure capabilities.
- **DID-based Identity**: Issuers are identified using `did:web` Decentralized Identifiers with Multikey verification methods for W3C credentials.

## Starting with OpenCerts v3

### 1. Install TrustVC CLI

```bash
npm install -g @trustvc/trustvc-cli
```

> Requires Node.js 22+

### 2. Generate a key pair

Generate a cryptographic key pair for signing credentials (`ecdsa-sd-2023` or `bbs-2023`):

```bash
trustvc key-pair-generation
```

The CLI will prompt you to select a cryptosuite (`ecdsa-sd-2023` or `bbs-2023`) and output a JSON key pair file containing `publicKeyMultibase` and `secretKeyMultibase`.

### 3. Create your issuer `did:web`

Generate a `did:web` DID document from your key pair:

```bash
trustvc did-web
```

The CLI will prompt for:
- Path to your key pair JSON file
- Your domain name (e.g., `example.edu`)

This generates a DID document that you must host at `https://<your-domain>/.well-known/did.json` for your DID to be resolvable. For example, if your DID is `did:web:example.edu`, the document must be accessible at `https://example.edu/.well-known/did.json`.

### 4. Prepare your W3C VC document

Structure your certificate data as a W3C Verifiable Credential:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2"
  ],
  "type": ["VerifiableCredential"],
  "issuer": "did:web:example.edu",
  "validFrom": "2024-01-01T00:00:00Z",
  "validUntil": "2029-12-31T23:59:59Z",
  "credentialStatus": {
    "id": "https://example.edu/credentials/statuslist/1#1",
    "type": "BitstringStatusListEntry",
    "statusPurpose": "revocation",
    "statusListIndex": "1",
    "statusListCredential": "https://example.edu/credentials/statuslist/1"
  },
  "credentialSubject": {
    "name": "John Doe",
    "course": "Bachelor of Science"
  }
}
```

### 5. Sign the credential

```bash
trustvc w3c-sign
```

The CLI will prompt for the path to your key pair, the unsigned credential JSON, and the cryptosuite to use. The output is a `signed_vc.json` with the cryptographic proof attached.

### 6. Verify

```bash
trustvc verify
```

This auto-detects the document format (W3C VC or OpenAttestation) and verifies integrity, status, and issuer identity.

### Using the SDK

For programmatic usage, you can use the [TrustVC SDK](https://github.com/TrustVC/trustvc) directly:

```typescript
import { signW3C, verifyDocument, VerificationType } from '@trustvc/trustvc';

// Sign
const signedCredential = await signW3C(rawDocument, {
  '@context': 'https://w3id.org/security/multikey/v1',
  id: 'did:web:example.edu#multikey-1',
  type: VerificationType.Multikey,
  controller: 'did:web:example.edu',
  publicKeyMultibase: '<publicKeyMultibase>',
  secretKeyMultibase: '<secretKeyMultibase>',
});

// Verify
const resultFragments = await verifyDocument(signedCredential);
```

## Migrating from v2

If you are currently using OpenCerts v2 with the OpenAttestation library directly, refer to the [Migration Guide](./migrations/oa_to_trustvc.md) for step-by-step instructions on migrating to W3C Verifiable Credentials with TrustVC. Note that TrustVC also supports OpenAttestation documents, so existing v2 certificates will continue to work.

## Resources

- [TrustVC CLI](https://github.com/TrustVC/trustvc-cli)
- [TrustVC SDK](https://github.com/TrustVC/trustvc)
- [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/)
- [OpenCerts Admin Portal](https://admin.opencerts.io/)

> For OpenCerts v2 documentation (using the OpenAttestation library), switch to the **v2** version using the version dropdown in the navigation bar. Note that TrustVC also supports both W3C VC and OpenAttestation documents.
