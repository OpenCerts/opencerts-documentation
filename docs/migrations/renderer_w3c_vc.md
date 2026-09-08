---
id: renderer_w3c_vc
title: Decentralised Renderer - W3C VC Support
sidebar_label: Renderer (W3C VC)
---

With OpenCerts v3, your decentralised renderer receives documents in the [W3C Verifiable Credentials (VC)](https://www.w3.org/TR/vc-data-model/) format instead of the OpenAttestation (OA) format. This guide covers the migration.

## You do not need a new renderer or new templates

This is the most important thing to know before you start: **this is not a rewrite.** Keep your existing renderer deployment, your existing template registry, and your existing template components. What changes is *how those components read the document*.

| | Changes? |
|---|---|
| Renderer deployment / hosting | No — the v3 credential points at the same URL, via `renderMethod[0].id` instead of `$template.url` |
| Template registry and `templateName` | No |
| Your template components' markup and styling | No |
| How components read data out of the document | **Yes — this is the migration** |

Your renderer also has to keep working with the OA documents you have already issued: certificates in the wild never expire, and recipients will keep opening them. So the goal is **one template that reads both formats**, not one template per format.

## The structural difference

### OA document (v2)

```json
{
  "issuers": [{ "name": "University" }],
  "$template": {
    "name": "CERTIFICATE",
    "type": "EMBEDDED_RENDERER",
    "url": "https://renderer.example.edu"
  },
  "recipient": { "name": "John Doe" },
  "name": "Bachelor of Science",
  "issuedOn": "2024-01-01T00:00:00Z",
  "additionalData": {}
}
```

The certificate data sits at the top level of the document, next to the issuer and template metadata.

### W3C VC (v3)

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://trustvc.io/context/render-method-context-v2.json",
    "https://schema.opencerts.io/transcripts/3.0/context.json"
  ],
  "type": ["VerifiableCredential"],
  "issuer": {
    "id": "did:web:example.edu",
    "name": "University"
  },
  "validFrom": "2024-01-01T00:00:00Z",
  "validUntil": "2029-12-31T23:59:59Z",
  "renderMethod": [
    {
      "id": "https://renderer.example.edu",
      "type": "EMBEDDED_RENDERER",
      "templateName": "CERTIFICATE"
    }
  ],
  "credentialSubject": {
    "type": "Transcript",
    "name": "Bachelor of Science",
    "recipient": { "name": "John Doe" },
    "additionalData": {}
  }
}
```

The certificate data has moved into `credentialSubject`, and the metadata around it has been renamed. Crucially, **the data fields themselves keep their names** — `name`, `recipient`, `transcript`, `additionalData` and the rest are the same fields you already render, one level deeper.

That is what makes a single template viable: normalise away the wrapper, and the body of your component is unchanged.

## Step 1: Normalise the document with `getDocumentData`

Solve exactly this problem, with a small helper that takes a document of any supported type and returns the flat data object. Copy it into your renderer:

```typescript
import {
  OpenAttestationDocument,
  RawVerifiableCredential,
  SignedVerifiableCredential,
  getDataV2,
  isRawV2Document,
  isRawV3Document,
  isWrappedV2Document,
  isWrappedV3Document,
  vc,
} from "@trustvc/trustvc";

export const getDocumentData = (
  document: OpenAttestationDocument | SignedVerifiableCredential | RawVerifiableCredential
): any => {
  if (
    isWrappedV3Document(document) ||
    isRawV3Document(document) ||
    vc.isSignedDocument(document) ||
    vc.isRawDocument(document)
  ) {
    return document.credentialSubject;
  } else if (isWrappedV2Document(document)) {
    return getDataV2(document);
  } else return document;
};
```

What each branch does:

- **W3C VC**, signed or still unsigned (`vc.isSignedDocument` / `vc.isRawDocument`) → returns `credentialSubject`
- **OA v3**, wrapped or raw → also returns `credentialSubject` (OA v3 already used that shape)
- **OA v2 wrapped** → returns `getDataV2(document)`, the unwrapped data with the merkle-proof salts stripped
- **anything else** (e.g. a plain raw v2 document you are previewing) → returned as-is

## Step 2: Update your template components

The change to each component is mechanical: derive the data object once at the top, then leave the rest of the component alone.

**Before** — reading straight off the OA document:

```tsx
export const CertificateTemplate: FunctionComponent<TemplateProps> = ({ document }) => {
  return (
    <div>
      <h1>{document.name}</h1>
      <p>Awarded to: {document.recipient.name}</p>
    </div>
  );
};
```

**After** — reading through the helper:

```tsx
import { getDocumentData } from "../utils";

export const CertificateTemplate: FunctionComponent<TemplateProps> = ({ document }) => {
  const data = getDocumentData(document);

  return (
    <div>
      <h1>{data.name}</h1>
      <p>Awarded to: {data.recipient.name}</p>
    </div>
  );
};
```

That component now renders both an OA v2 certificate and a W3C VC, because in both cases `data` is the same flat object with the same field names. No `if` statements, no second template, no duplicated markup.

## Step 3: Handle the fields that live outside `credentialSubject`

`getDocumentData` covers the certificate data. A few things are *metadata* and sit outside it in both formats, so they need a small helper of their own if your template displays them:

| Shown on your certificate | OA v2 | W3C VC |
|---|---|---|
| Issuer name | `issuers[0].name` | `issuer.name` (or the `issuer` string, when it is a bare DID) |
| Issue date | `issuedOn` | `validFrom` |
| Expiry date | `expiresOn` | `validUntil` |
| Renderer URL / template name | `$template.url` / `$template.name` | `renderMethod[0].id` / `renderMethod[0].templateName` |

For example:

```typescript
import { vc } from "@trustvc/trustvc";

export const getIssuerName = (document: any): string | undefined =>
  vc.isSignedDocument(document) || vc.isRawDocument(document)
    ? typeof document.issuer === "string"
      ? document.issuer
      : document.issuer?.name
    : getDocumentData(document)?.issuers?.[0]?.name;

export const getIssuedOn = (document: any): string | undefined =>
  vc.isSignedDocument(document) || vc.isRawDocument(document)
    ? document.validFrom
    : getDocumentData(document)?.issuedOn;
```

## Step 4: Update your types

Widen your document type so both formats type-check, and keep the per-format detail in the helpers rather than in every component:

```typescript
import {
  OpenAttestationDocument,
  RawVerifiableCredential,
  SignedVerifiableCredential,
} from "@trustvc/trustvc";

export type OpenCertsDocument =
  | OpenAttestationDocument
  | SignedVerifiableCredential
  | RawVerifiableCredential;

export interface TemplateProps {
  document: OpenCertsDocument;
}
```

If you want a typed view of your own certificate data, type the *result* of `getDocumentData` instead of the document:

```typescript
export interface CertificateData {
  name: string;
  recipient: { name: string };
  transcript?: { name: string; grade?: string; courseCode?: string }[];
  additionalData?: Record<string, unknown>;
}

const data = getDocumentData(document) as CertificateData;
```

## Step 5: Test with both formats

Keep one OA sample and one signed W3C VC sample in your renderer's fixtures and render both on every change. A template that only ever gets tested against v3 will quietly break the certificates you issued last year — and those are the ones you cannot re-issue.

If you need a v3 sample to test against, the [Transcripts guide](../transcripts.md) walks through producing a signed one with `trustvc-cli`.

## Additional Resources

- [TrustVC GitHub](https://github.com/TrustVC/trustvc)
- [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/)
