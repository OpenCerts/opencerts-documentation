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
| **Identity** | DNS-TXT record + Document Store | `did:web` hosted at `/.well-known/did.json` |
| **Signing** | Document wrapping (merkle tree) | `ecdsa-sd-2023` or `bbs-2023` cryptosuites |
| **Issuance** | Document Store (Smart Contract) | Direct DID-based signing |
| **Revocation** | Document Store `revoke` method (on-chain) | Bitstring Status List (off-chain, hosted) |

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
- **v3:** Issuers are identified using `did:web` Decentralized Identifiers with Multikey verification methods. See [Setting Up `did:web` Identity](#setting-up-didweb-identity) for details.

### 3. Signing

- **v2:** Documents were wrapped using OA CLI, then issued by calling the `issue` method on a Document Store smart contract.
- **v3:** Documents are signed directly using `signW3C` with `ecdsa-sd-2023` (default) or `bbs-2023` cryptosuites. No on-chain transaction is required for issuance.

### 4. Verification

- **v2:** Used `@opencerts/verify` built on `@govtechsg/oa-verify` for fragment-based verification.
- **v3:** Uses `verifyDocument` from `@trustvc/trustvc`, which auto-detects the document format and handles both OA and W3C VC verification.

### 5. Revocation

- **v2:** Revocation was done on-chain by calling the `revoke` method on the Document Store smart contract.
- **v3:** Uses [Bitstring Status Lists](https://www.w3.org/TR/vc-bitstring-status-list/) — an off-chain approach where a hosted status list tracks revoked credentials. See [Setting Up Credential Revocation](#setting-up-credential-revocation) for details.

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
- `issuers[].documentStore` + `identityProof` → issuer DID (`did:web:...`) — see [Setting Up `did:web` Identity](#setting-up-didweb-identity)
- `$template` → renderer configuration (check your renderer setup)
- Certificate data fields → `credentialSubject`
- To support revocation, add a `credentialStatus` field — see [Setting Up Credential Revocation](#setting-up-credential-revocation)

### Step 3: Sign with TrustVC

Use `signW3C` to sign credentials. The key pair used here comes from your `did:web` setup — see [Setting Up `did:web` Identity](#setting-up-didweb-identity) for how to generate these keys.

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

## Setting Up `did:web` Identity

OpenCerts v3 uses [`did:web`](https://w3c-ccg.github.io/did-method-web/) to identify issuers. You will need to generate a DID document and host it on your domain.

#### Generate a DID Document

```typescript
import { issuer } from '@trustvc/trustvc';

const { issueDID, CryptoSuite } = issuer;

const issuedDidWeb = await issueDID({
  domain: 'example.com',
  type: CryptoSuite.EcdsaSd2023,
});

// The DID document to host publicly
console.log(JSON.stringify(issuedDidWeb.wellKnownDid, null, 2));

// Store these securely — they are needed for signing
console.log('Key pairs:', issuedDidWeb.didKeyPairs);
```

> **Important**: Securely store the generated key pairs (`didKeyPairs`). They are required for signing credentials.

#### Host the DID Document

Place the generated DID document at `/.well-known/did.json` on your web server:

- Serve the file over **HTTPS** with a valid SSL certificate.
- Set the content type to `application/json`.
- Configure appropriate **CORS** headers (`Access-Control-Allow-Origin: *`) — without this, web-based verifiers cannot resolve your DID.

For example, a DID of `did:web:example.com` resolves to `https://example.com/.well-known/did.json`.

You can also host path-based DIDs for different departments or environments:

| DID | Document Location |
|---|---|
| `did:web:example.com` | `https://example.com/.well-known/did.json` |
| `did:web:example.com:department-a` | `https://example.com/department-a/did.json` |

## Setting Up Credential Revocation

OpenCerts v3 uses the [Bitstring Status List](https://www.w3.org/TR/vc-bitstring-status-list/) method for credential revocation. This allows you to revoke or suspend issued credentials without modifying the original credential.

#### How It Works

A **Bitstring Status List** is a sequence of bits where each bit corresponds to a credential:

- `0` — credential is valid (active)
- `1` — credential is revoked or suspended

The status list is hosted as a signed Verifiable Credential at a publicly accessible URL. Verifiers fetch this list and check the bit at the credential's index.

#### Create a Status List

```typescript
import {
  createCredentialStatusPayload,
  signW3C,
  StatusList,
  VCBitstringCredentialSubject,
} from '@trustvc/trustvc';

// URL where the status list will be hosted
const hostingUrl = 'https://example.com/credentials/status/1';

// Initialize a new status list
const statusList = new StatusList({ length: 131072 });

// Encode the status list
const encodedList = await statusList.encode();

// Create the credential status payload
const credentialSubject: VCBitstringCredentialSubject = {
  id: `${hostingUrl}#list`,
  type: 'BitstringStatusList',
  statusPurpose: 'revocation',
  encodedList,
};

const keyPair = {
  '@context': 'https://w3id.org/security/multikey/v1',
  id: 'did:web:example.com#keys-1',
  type: 'Multikey',
  controller: 'did:web:example.com',
  secretKeyMultibase: '<secretKeyMultibase>',
  publicKeyMultibase: '<publicKeyMultibase>',
};

const credentialStatusVC = await createCredentialStatusPayload(
  { id: hostingUrl, credentialSubject },
  keyPair,
  'BitstringStatusListCredential',
  'ecdsa-sd-2023'
);

const { signed, error } = await signW3C(credentialStatusVC, keyPair);
if (error) throw new Error(error);
```

#### Reference the Status List in Your Credential

Include a `credentialStatus` field in your raw credential before signing:

```json
"credentialStatus": {
  "id": "https://example.com/credentials/status/1#94567",
  "type": "BitstringStatusListEntry",
  "statusPurpose": "revocation",
  "statusListIndex": "94567",
  "statusListCredential": "https://example.com/credentials/status/1"
}
```

#### Revoke a Credential

To revoke a credential, fetch the existing status list, flip the bit at the credential's index, and re-sign:

```typescript
import {
  createCredentialStatusPayload,
  fetchCredentialStatusVC,
  signW3C,
  StatusList,
  VCBitstringCredentialSubject,
} from '@trustvc/trustvc';

// Fetch the existing status list
const credentialStatusVC = await fetchCredentialStatusVC(
  'https://example.com/credentials/status/1'
);

// Decode, update, and re-encode
const statusList = await StatusList.decode({
  encodedList: credentialStatusVC.credentialSubject.encodedList,
});
statusList.setStatus(94567, true); // true = revoked
const encodedList = await statusList.encode();

// Re-sign and re-host the updated status list
const credentialSubject: VCBitstringCredentialSubject = {
  id: 'https://example.com/credentials/status/1#list',
  type: 'BitstringStatusList',
  statusPurpose: 'revocation',
  encodedList,
};

const updatedVC = await createCredentialStatusPayload(
  { id: 'https://example.com/credentials/status/1', credentialSubject },
  keyPair,
  'BitstringStatusListCredential',
  'ecdsa-sd-2023'
);

const { signed, error } = await signW3C(updatedVC, keyPair);
if (error) throw new Error(error);
// Host the updated signed VC at the same URL
```

#### Host the Status List

Host the signed status list VC at the URL specified in `statusListCredential` (e.g., `https://example.com/credentials/status/1`). Ensure:

- The endpoint is publicly accessible over **HTTPS**.
- **CORS** is enabled (`Access-Control-Allow-Origin: *`) — without this, web-based verifiers cannot check credential status.
- The content type is `application/json`.

## Backward Compatibility

`verifyDocument` supports both OA documents and W3C VC documents. Existing v1 and v2 certificates will continue to verify correctly without any changes.

## Additional Resources

- [TrustVC GitHub](https://github.com/TrustVC/trustvc)
- [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/)
- [W3C Bitstring Status List](https://www.w3.org/TR/vc-bitstring-status-list/)
- [did:web Method Specification](https://w3c-ccg.github.io/did-method-web/)
