---
id: oa_cli_to_tvc_cli
title: Migration Guide - From open-attestation-cli & Admin Website to trustvc-cli
sidebar_label: OA-cli to trustvc-cli
---

If you currently issue certificates by wrapping/signing documents with the [OpenAttestation CLI](https://github.com/Open-Attestation/open-attestation-cli) (npm package `@govtechsg/open-attestation-cli`, run as the `open-attestation` command) and then using the [Admin Website](https://admin.opencerts.io/) to deploy a Document Store and issue them on-chain, this guide walks you through switching to [`@trustvc/trustvc-cli`](https://github.com/TrustVC/trustvc-cli) (the `trustvc` command) to issue **W3C Verifiable Credentials (VC)** instead.

This is the practical, command-by-command companion to the [OpenAttestation to TrustVC migration guide](./oa_to_trustvc.md), which covers the same migration from the SDK/developer side. Use that guide if you're integrating `@trustvc/trustvc` into your own issuing application; use this one if you issue certificates by running CLI commands directly.

## Who this is for

Issuers who currently:

- Run `open-attestation-cli` (the `open-attestation` command, or an equivalent wrap/sign script) to produce OpenAttestation Verifiable Documents (OA VD), and
- Log into [admin.opencerts.io](https://admin.opencerts.io/) with Metamask/Ledger to deploy a Document Store and call `issue`/`revoke` on it.

None of that changes what your recipients see today — but OpenCerts v3 issuers sign W3C VCs directly and no longer need a Document Store or the Admin Website at all.

## Install `trustvc-cli`

Requires Node.js 22+.

```sh
npm install -g @trustvc/trustvc-cli
```

Or run commands ad-hoc without installing:

```sh
npx @trustvc/trustvc-cli <command>
```

Every command below is invoked as `trustvc <command>` and is fully interactive — it will prompt you for file paths and options, so no config file is required.

## Step 1: Get the data out of your legacy OA VD

There is no one-command "convert OA VD to W3C VC" tool — the two formats are different enough that re-issuing is a re-authoring exercise, not a conversion. Start by unwrapping your existing wrapped OA document to recover the plain data fields (recipient name, course, dates, etc.) without the merkle-proof wrapping:

```sh
trustvc oa-unwrap
```

You'll be prompted for the path to your wrapped OA document (or a directory of them) and an output directory. The unwrapped JSON is what you'll pull `credentialSubject` data from in Step 4.

## Step 2: Create and host your `did:web` identity

In OA, your issuer identity was a DNS-TXT record pointing at your Document Store contract. In W3C VC, it's a [`did:web`](https://w3c-ccg.github.io/did-method-web/) DID hosted on your own domain — no smart contract required.

**Generate a key pair:**

```sh
trustvc key-pair-generation
```

Prompts you for a cryptosuite (`ECDSA-SD-2023` or `BBS-2023`) and an output directory, and writes `keypair.json`.

**Generate the DID from that key pair:**

```sh
trustvc did-web
```

Prompts you for the path to `keypair.json`, the same cryptosuite, your domain, and an output directory. This produces:

- `wellknown.json` — your DID document
- `didKeyPairs.json` — your signing keys plus DID references. Keep this file private; you'll need it to sign credentials in Step 5.

**Host `wellknown.json`** at `https://<your-domain>/.well-known/did.json`:

- Serve it over HTTPS with a valid certificate.
- Set `Content-Type: application/json`.
- Enable CORS (`Access-Control-Allow-Origin: *`) — without this, web-based verifiers can't resolve your DID.

> **Note:** Unlike OA (which supported DNS-TXT and DNS-DID identity proofs), TrustVC does not support a DNS-based identity method for issuing W3C VCs — `did:web` is the only method `trustvc-cli` currently exposes. (The underlying SDK also supports `did:key`, a self-certifying method that needs no hosting, but it isn't yet available as a `trustvc-cli` command.) DNS-TXT/DNS-DID are only still used by TrustVC to verify your existing legacy OA documents during the transition.

## Step 3: Create and host your own `@context`

If your certificate has custom fields (e.g. course name, grade, additional data beyond a generic credential), define your own JSON-LD `@context` file describing them and host it at a URL you control — `trustvc-cli` doesn't generate or host this for you.

A signed VC references one or more contexts as an array; typically the base VC context plus your own:

```json
"@context": [
  "https://www.w3.org/ns/credentials/v2",
  "https://w3id.org/security/data-integrity/v2",
  "https://your-domain.com/context/your-certificate-context.json"
]
```

Host `your-certificate-context.json` on your own domain (or any static file host) over HTTPS, with CORS enabled, the same way you host your DID document.

## Step 4: Author your unsigned W3C VC

Using the data recovered in Step 1, author an unsigned VC JSON. Key field mapping from OA VD to W3C VC:

| OA VD | W3C VC |
|---|---|
| `issuers[].name` / `identityProof` / `documentStore` | `issuer` (your `did:web:...` from Step 2) |
| `$template` | your renderer's own configuration (see Step 6) |
| top-level certificate data fields | `credentialSubject` |
| n/a | `@context` (your context from Step 3) |
| n/a (revocation was on-chain) | `credentialStatus` (only if you need revocation — see Step 6) |

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://w3id.org/security/data-integrity/v2",
    "https://your-domain.com/context/your-certificate-context.json"
  ],
  "type": ["VerifiableCredential"],
  "issuer": "did:web:your-domain.com",
  "validFrom": "2024-01-01T00:00:00Z",
  "credentialSubject": {
    "name": "John Doe",
    "course": "Bachelor of Science"
  }
}
```

## Step 5: Sign with `trustvc-cli`

This replaces both `open-attestation-cli`'s wrap/sign step and the Admin Website's "issue" transaction:

```sh
trustvc w3c-sign
```

You'll be prompted for the path to `didKeyPairs.json` (from Step 2), the path to your unsigned VC JSON (from Step 4), and the cryptosuite — this must match what you used in Step 2. The output is `signed_vc.json`, your issued credential.

**That's it — no need to go to admin.opencerts.io.** There's no Document Store to deploy and no on-chain `issue` transaction to send. Once `w3c-sign` produces `signed_vc.json`, the document is issued; hand it to your recipient the same way you did before (download link, email, etc.).

## Step 6 (optional): Set up revocation

Skip this step if you don't need to revoke or suspend credentials. On-chain Document Store `revoke` has no direct equivalent — v3 uses the [W3C Bitstring Status List](https://www.w3.org/TR/vc-bitstring-status-list/), an off-chain list you host yourself.

**Create a status list once:**

```sh
trustvc credential-status-create
```

Prompts you for your key pair path, cryptosuite, the URL you intend to host the list at (e.g. `https://your-domain.com/credentials/statuslist/1`), an output directory, and the list length (default `131072`). Host the resulting file at exactly the URL you specified, over HTTPS with CORS enabled.

Then, when authoring each unsigned VC in Step 4, add a `credentialStatus` field referencing that list and a unique index for that credential:

```json
"credentialStatus": {
  "id": "https://your-domain.com/credentials/statuslist/1#94567",
  "type": "BitstringStatusListEntry",
  "statusPurpose": "revocation",
  "statusListIndex": "94567",
  "statusListCredential": "https://your-domain.com/credentials/statuslist/1"
}
```

**To revoke a credential later**, fetch and update the hosted list, then re-host it at the same URL:

```sh
trustvc credential-status-update
```

Prompts you for the path/URL of the existing status list, your key pair, and the index to revoke or suspend. Re-host the updated output at the same URL it was originally hosted at.

For the full picture (including the underlying SDK calls), see [Setting Up Credential Revocation](./oa_to_trustvc.md#setting-up-credential-revocation) in the SDK migration guide.

## Step 7: Update your renderer

Your certificate's decentralised renderer was built to read the OA document structure (`issuers`, `$template`, top-level fields). It needs to be updated to read the W3C VC structure (`issuer`, `credentialSubject`) instead — see the [Decentralised Renderer - W3C VC Support](./renderer_w3c_vc.md) guide for the full walkthrough.

## Step 8: Verify

Once signed and rendered, verification works the same way it always did for your recipients — go to [opencerts.io](https://opencerts.io) and upload or drag in `signed_vc.json`. Verification for W3C VCs resolves your `did:web` identity and (if you set one up) checks your hosted status list automatically; no Document Store lookup is involved.