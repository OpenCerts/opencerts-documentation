---
id: renderer_w3c_vc
title: Decentralised Renderer - W3C VC Support
sidebar_label: Renderer (W3C VC)
---

With OpenCerts v3, the decentralised renderer needs to be updated to handle documents in the [W3C Verifiable Credentials (VC)](https://www.w3.org/TR/vc-data-model/) format. This guide covers the changes required.

## Overview

In OpenCerts v2, renderers received OpenAttestation wrapped documents with a specific structure (`issuers`, `$template`, top-level certificate data). In v3, renderers receive W3C VCs with a different structure (`issuer`, `credentialSubject`).

Your renderer must be able to:
1. Detect whether the incoming document is a OA document or a W3C VC.
2. Extract and render the relevant data from either format.

## Key Structural Differences

### v2 Document Structure (OA)

```json
{
  "issuers": [{ "name": "University" }],
  "$template": {
    "name": "CERTIFICATE",
    "type": "EMBEDDED_RENDERER",
    "url": "https://renderer.example.edu"
  },
  "recipient": {
    "name": "John Doe"
  },
  "name": "Bachelor of Science",
  "additionalData": {}
}
```

### v3 Document Structure (W3C VC)

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2"
  ],
  "type": ["VerifiableCredential"],
  "issuer": {
    "id": "did:web:example.edu",
    "name": "University"
  },
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

## Updating Your Renderer

### Step 1: Detect Document Version

Use `vc.isSignedDocument` from TrustVC to detect if a document is a signed W3C VC:

```typescript
import { vc } from '@trustvc/trustvc';

const isW3CVC = vc.isSignedDocument(document);
```

### Step 2: Update Template Types

Create types that support the W3C VC structure:

```typescript
export interface OpenCertsW3CCertificate {
  "@context": string[];
  type: string[];
  issuer: string | {
    id: string;
    type?: string;
    name: string;
  };
  validFrom?: string;
  validUntil?: string;
  credentialSubject: {
    name: string;
    course?: string;
    // Add your custom fields here
  };
}
```

### Step 3: Update Template Components

Update your template components to extract data from the new structure:

```tsx
import React, { FunctionComponent } from "react";
import { OpenCertsW3CCertificate } from "../types";

interface TemplateProps {
  document: OpenCertsW3CCertificate;
}

export const CertificateTemplate: FunctionComponent<TemplateProps> = ({
  document,
}) => {
  const recipientName = document.credentialSubject.name;
  const issuerName =
    typeof document.issuer === "string"
      ? document.issuer
      : document.issuer.name;
  const course = document.credentialSubject.course;

  return (
    <div>
      <h1>{course}</h1>
      <p>Awarded to: {recipientName}</p>
      <p>Issued by: {issuerName}</p>
    </div>
  );
};
```

### Step 4: Supporting Both OA and W3C VC Documents

If your renderer needs to support both OA and W3C VC documents, you can create a wrapper component:

```tsx
import React, { FunctionComponent } from "react";
import { vc } from "@trustvc/trustvc";

interface UnifiedTemplateProps {
  document: any;
}

export const UnifiedCertificateTemplate: FunctionComponent<
  UnifiedTemplateProps
> = ({ document }) => {
  if (vc.isSignedDocument(document)) {
    // W3C VC: extract from credentialSubject
    const { name, course } = document.credentialSubject;
    const issuerName =
      typeof document.issuer === "string"
        ? document.issuer
        : document.issuer.name;
    return renderCertificate(name, course, issuerName);
  } else {
    // OA: extract from top-level fields
    const name = document.recipient?.name;
    const course = document.name;
    const issuerName = document.issuers?.[0]?.name;
    return renderCertificate(name, course, issuerName);
  }
};

function renderCertificate(
  recipientName: string,
  course: string,
  issuerName: string
) {
  return (
    <div>
      <h1>{course}</h1>
      <p>Awarded to: {recipientName}</p>
      <p>Issued by: {issuerName}</p>
    </div>
  );
}
```

## Testing

Ensure you test your renderer with both OA and W3C VC sample documents to verify backward compatibility.

## Additional Resources

- [W3C Verifiable Credentials Data Model](https://www.w3.org/TR/vc-data-model/)
- [TrustVC GitHub](https://github.com/TrustVC/trustvc)
