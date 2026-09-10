---
id: transcripts
title: OpenCerts Transcripts
sidebar_label: Transcripts
---

An OpenCerts transcript is a [W3C Verifiable Credential](https://www.w3.org/TR/vc-data-model/) that adheres to [the OpenCerts Transcript Schema](https://schema.opencerts.io/transcripts/3.0). In this guide, we will issue one end to end with the [TrustVC CLI](https://github.com/TrustVC/trustvc-cli).

> Already issuing transcripts as OpenAttestation documents with `open-attestation-cli` and the Admin Website? See the [OA-cli to trustvc-cli migration guide](./migrations/oa_cli_to_tvc_cli.md), or switch to the **v2** version in the navigation bar for the previous flow.

## Prerequisite

- Node.js 22+
- Install the CLI:

  ```bash
  npm install -g @trustvc/trustvc-cli
  ```

  Or run any command ad-hoc with `npx @trustvc/trustvc-cli <command>`.

- Create a working folder:

  ```bash
  mkdir -p opencerts-transcripts
  ```

> For the rest of this guide, we will assume that every action occurs from the `opencerts-transcripts` folder.

Every command below is interactive — it prompts you for paths and options, so there is no config file to maintain.

## Step 1: Generate a key pair

```bash
trustvc key-pair-generation
```

You will be prompted for:

- the cryptosuite — `ECDSA-SD-2023` or `BBS-2023` (remember your choice, every later command must use the same one)
- an output directory

This writes `keypair.json`, containing `publicKeyMultibase` and `secretKeyMultibase`. Keep it private.

## Step 2: Create your issuer identity (`did:web`)

Your issuer identity is a [`did:web`](https://w3c-ccg.github.io/did-method-web/) DID hosted on your own domain — there is no Document Store contract and no DNS-TXT record to set up.

```bash
trustvc did-web
```

You will be prompted for:

- the path to `keypair.json` from Step 1
- the domain where the DID document will be hosted, given as the full URL, e.g. `https://your-domain.com/.well-known/did.json`
- an output directory

This produces two files:

- `wellknown.json` — your DID document, to be published
- `didKeyPairs.json` — your signing keys plus their DID references. **Keep this file private**; you need it to sign in Step 4.

Host `wellknown.json` at `https://<your-domain>/.well-known/did.json`:

- serve it over HTTPS with a valid certificate
- set `Content-Type: application/json`
- enable CORS (`Access-Control-Allow-Origin: *`) — without this, web-based verifiers cannot resolve your DID

For a domain of `your-domain.com`, your DID is `did:web:your-domain.com`.

## Step 3: Create the unsigned transcript

Create a file called `opencerts.json` with the following content:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://trustvc.io/context/render-method-context-v2.json",
    "https://schema.opencerts.io/transcripts/3.0/context.json"
  ],
  "type": ["VerifiableCredential"],
  "issuer": {
    "id": "did:web:your-domain.com",
    "name": "Govtech"
  },
  "validFrom": "2019-05-29T00:00:00+08:00",
  "renderMethod": [
    {
      "id": "https://demo-renderer.opencerts.io",
      "type": "EMBEDDED_RENDERER",
      "templateName": "GOVTECH_DEMO"
    }
  ],
  "credentialSubject": {
    "type": "Transcript",
    "name": "Govtech Demo Certificate",
    "description": "Govtech Demo Certificate",
    "admissionDate": "2017-08-01T00:00:00+08:00",
    "graduationDate": "2022-08-01T00:00:00+08:00",
    "recipient": {
      "name": "Your Name",
      "nric": "SXXXXXXXY",
      "studentId": "123456"
    },
    "transcript": [
      {
        "name": "Introduction to Programming",
        "grade": "A+",
        "courseCredit": "3",
        "courseCode": "CS 1110",
        "examinationDate": "2017-12-01T00:00:00+08:00"
      },
      {
        "name": "Object Oriented Programming in Java",
        "grade": "A+",
        "courseCredit": "4",
        "courseCode": "CS 2110",
        "examinationDate": "2017-12-01T00:00:00+08:00"
      },
      {
        "name": "Microeconomics",
        "grade": "A+",
        "courseCredit": "4",
        "courseCode": "ECON 3030",
        "examinationDate": "2018-05-01T00:00:00+08:00"
      },
      {
        "name": "Macroeconomics",
        "grade": "A",
        "courseCredit": "4",
        "courseCode": "ECON 3040",
        "examinationDate": "2018-05-01T00:00:00+08:00"
      },
      {
        "name": "Econometrics",
        "grade": "A-",
        "courseCredit": "4",
        "courseCode": "ECON 3120",
        "examinationDate": "2018-05-01T00:00:00+08:00"
      }
    ],
    "additionalData": {
      "merit": "Y",
      "transcriptId": "001"
    }
  }
}
```

> Don't forget to replace `issuer.id` with your own `did:web` from Step 2, and `renderMethod[0].id` with the URL of your own decentralised renderer.

### Things that will trip you up

The three points below are enforced by JSON-LD processing, not by a friendly validator. If any of them is wrong, signing fails with a generic `Safe mode validation error`.

- **All three `@context` entries are required.** `https://www.w3.org/ns/credentials/v2` is the base VC context; `render-method-context-v2.json` defines the `EMBEDDED_RENDERER` type and its `templateName` used by `renderMethod` (and `EMBEDDED_RENDERER` is the only renderer type it defines); `https://schema.opencerts.io/transcripts/3.0/context.json` defines the transcript terms (`recipient`, `transcript`, `courseCode`, `skills`, and so on). Drop any one of them and the terms it defines become undefined.
- **`credentialSubject.type` must be `"Transcript"`.** The transcript terms live in a type-scoped context, so they only resolve on a node typed as `Transcript`.
- **Do not set a top-level `id`.** TrustVC generates one (a `urn:uuid:...`) when signing and rejects the document if you supply your own. If you have your own transcript or document number, put it inside `credentialSubject` — `additionalData` is the natural home for it (`additionalData.transcriptId` above), and any key you invent there works without changing the context. Use `credentialSubject.id` only for an identifier of the *recipient*, and only if it is an absolute URI such as a DID or a resolvable URL; a bare number is rejected. Since the credential's own `id` is only assigned at signing time, keep a mapping from your internal id to the issued `urn:uuid:...` if you need to look documents back up later.

### Coming from an OpenCerts v2 transcript

| v2 (OpenAttestation) | v3 (W3C VC) |
| --- | --- |
| `issuers[0].name`, `documentStore`, `identityProof` | `issuer` — your `did:web` |
| `$template` | `renderMethod[0]` (`id`, `type`, `templateName`) |
| `issuedOn` | `validFrom` (and `validUntil` for expiry) |
| `id` | generated at signing time — omit it, and move your own identifier into `credentialSubject.additionalData` |
| `name`, `description`, `recipient`, `transcript`, `additionalData` and other data fields | the same fields, nested under `credentialSubject` |
| on-chain `revoke` on the Document Store | `credentialStatus` — see [Revocation](#optional-revocation) |

The schema also adds fields that had no v2 equivalent, including `attainmentDate`, `qualificationLevel`, `fieldOfStudy`, `cumulativeScore` and `skills`. Explore [the schema](https://schema.opencerts.io/transcripts/3.0) to see everything you can express.

## Step 4: Sign the transcript

```bash
trustvc w3c-sign
```

You will be prompted, in this order, for:

- the path to your Verifiable Credential JSON file (`opencerts.json` from Step 3)
- the path to your `didKeyPairs.json` (from Step 2)
- the cryptosuite — this must match what you chose in Step 1
- an output directory

The output is `signed_vc.json`, with a `DataIntegrityProof` attached.

🎉 Congratulations! You successfully created your first valid OpenCerts transcript. **That's it — the document is issued.** There is no Document Store to deploy and no on-chain transaction to send, so nothing further is needed at [admin.opencerts.io](https://admin.opencerts.io/). Hand `signed_vc.json` to your recipient however you like.

## Step 5: Verify

```bash
trustvc verify
```

This auto-detects the document format, then checks the proof, the credential status and your issuer identity — which means it resolves `https://your-domain.com/.well-known/did.json`, so make sure you have published it. Your recipients can do the same by dropping `signed_vc.json` onto [opencerts.io](https://opencerts.io).

## Optional: revocation

Skip this if you never need to revoke or suspend a transcript. v3 uses the [W3C Bitstring Status List](https://www.w3.org/TR/vc-bitstring-status-list/), an off-chain list you host yourself, created with `trustvc credential-status-create` and updated with `trustvc credential-status-update`. Each transcript then carries a `credentialStatus` block pointing at your list. See [Step 6 of the migration guide](./migrations/oa_cli_to_tvc_cli.md#step-6-optional-set-up-revocation) for the full walkthrough.

## Rendering

`renderMethod` points at your decentralised renderer, which must read the W3C VC structure (`issuer`, `credentialSubject`) rather than the OA structure. See [Decentralised Renderer - W3C VC Support](./migrations/renderer_w3c_vc.md).

## Additional information

- [OpenCerts Transcript Schema 3.0](https://schema.opencerts.io/transcripts/3.0) and its [JSON-LD context](https://schema.opencerts.io/transcripts/3.0/context.json)
- Full documentation about the CLI is available on [Github](https://github.com/TrustVC/trustvc-cli)
- [TrustVC SDK](https://github.com/TrustVC/trustvc), if you would rather issue programmatically than from the command line
