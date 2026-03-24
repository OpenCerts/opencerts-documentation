---
id: oa_to_trustvc
title: Migration Guide - OpenAttestation to TrustVC
sidebar_label: OA to TrustVC
---

OpenCerts v3 uses [TrustVC](https://github.com/TrustVC/trustvc), a comprehensive wrapper library that supports both [W3C Verifiable Credentials (VC)](https://www.w3.org/TR/vc-data-model/) and [OpenAttestation](https://www.openattestation.com) Verifiable Documents. This guide covers the key changes and steps required to migrate to issuing W3C VCs.

## Overview

| | OpenCerts v2 (OA) | OpenCerts v3 (TrustVC) |
|---|---|---|
| **Standard** | OpenAttestation v2 | W3C VC Data Model v2.0 |
| **Document Format** | OA Wrapped Document | W3C VC with Data Integrity Proofs |
| **Identity** | DNS-TXT / Document Store | `did:web` with Multikey verification |
| **Signing** | Document wrapping (merkle tree) | `ecdsa-sd-2023` or `bbs-2023` cryptosuites |
| **Issuance** | Document Store (Smart Contract) | Direct DID-based signing |

## Key Changes

### 1. Document Format

OpenCerts v2 used the OpenAttestation wrapped document format. OpenCerts v3 adopts the [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model/) via TrustVC.

**v2 (OA format):**
```json
{
  "issuers": [
    {
      "name": "Example University",
      "documentStore": "0x1234...",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "example.edu"
      }
    }
  ],
  "$template": {
    "name": "EXAMPLE_CERT",
    "type": "EMBEDDED_RENDERER",
    "url": "https://renderer.example.edu"
  }
}
```

**v3 (W3C VC format):**
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

> Note: W3C VC documents do not require wrapping. They are signed directly using `signW3C`.

### 2. Identity

- **v2:** Used `DNS-TXT` records pointing to a Document Store smart contract address.
- **v3:** Issuers are identified using `did:web` Decentralized Identifiers with Multikey verification methods.

### 3. Signing

- **v2:** Documents were wrapped using OA CLI, then issued by calling the `issue` method on a Document Store smart contract.
- **v3:** Documents are signed directly using `signW3C` with `ecdsa-sd-2023` (default) or `bbs-2023` cryptosuites. No on-chain transaction is required for issuance.

### 4. Verification

- **v2:** Used `@opencerts/verify` built on `@govtechsg/oa-verify` for fragment-based verification.
- **v3:** Uses `verifyDocument` from `@trustvc/trustvc`, which auto-detects the document format and handles both OA and W3C VC verification.

## Migration Steps

### Step 1: Update Dependencies

```bash
# Remove OA dependencies
npm uninstall @govtechsg/open-attestation @opencerts/verify @govtechsg/oa-verify

# Install TrustVC
npm install @trustvc/trustvc
```

### Step 2: Update Document Schema

Convert your raw document templates from the OA format to the W3C VC format.

Key mapping:
- `issuers` → `issuer` (a string DID or object with `id`, `type`, `name`)
- `issuers[].documentStore` + `identityProof` → issuer DID (`did:web:...`)
- `$template` → renderer configuration (check your renderer setup)
- Certificate data fields → `credentialSubject`

### Step 3: Sign with TrustVC

Use `signW3C` to sign credentials:

```typescript
import { signW3C, VerificationType } from '@trustvc/trustvc';

const signedCredential = await signW3C(rawDocument, {
  '@context': 'https://w3id.org/security/multikey/v1',
  id: 'did:web:example.edu#multikey-1',
  type: VerificationType.Multikey,
  controller: 'did:web:example.edu',
  publicKeyMultibase: '<publicKeyMultibase>',
  secretKeyMultibase: '<secretKeyMultibase>',
});
```

### Step 4: Update Verification

Use `verifyDocument` to verify credentials:

```typescript
import { verifyDocument } from '@trustvc/trustvc';

const resultFragments = await verifyDocument(signedDocument);
```

`verifyDocument` automatically handles both OA and W3C VC documents. For `ecdsa-sd-2023` and `bbs-2023` signed documents, derivation is handled internally.

### Step 5: Update Renderer

Your decentralised renderer must be updated to handle the W3C VC document structure. See the [Decentralised Renderer W3C VC Update](./renderer_w3c_vc.md) guide for details.

## Backward Compatibility

`verifyDocument` supports both OA documents and W3C VC documents. Existing v1 and v2 certificates will continue to verify correctly without any changes.

## Additional Resources

- [TrustVC GitHub](https://github.com/TrustVC/trustvc)
- [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/)
