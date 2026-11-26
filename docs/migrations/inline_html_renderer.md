---
id: inline_html_renderer
title: Inline HTML Renderer
sidebar_label: Inline Renderer (Beta)
---

:::caution Beta
The inline HTML renderer currently ships only on the `@trustvc/trustvc@beta` tag — it is not yet in `latest`. Install with `npm install @trustvc/trustvc@beta`, and expect APIs to change before the stable release.
:::

As an alternative to hosting a [decentralised renderer](./renderer_w3c_vc.md), a W3C VC certificate can carry its own HTML and CSS template directly in the signed document. A viewer fills that markup against `credentialSubject` and displays it offline, with no renderer URL to host or keep available.

## Why Use It

- **No renderer to host.** Skip Step 5 of the [OA to TrustVC migration guide](./oa_to_trustvc.md#step-5-update-renderer) entirely — there's no separate renderer app to deploy or keep online.
- **The template is covered by the proof.** Because the HTML and CSS are part of the signed credential, they can't drift from what was issued.
- **Renders fully offline.** No network request is needed to display the certificate.

A certificate can still carry a URL `renderMethod` entry alongside the inline one, so older verifiers (and any viewer where the inline render fails) fall back to the hosted renderer unchanged.

## Issuing a Certificate With an Inline Template

This assumes you already have a `did:web` issuer and a `DocumentBuilder` set up, as in [Step 3: Sign with TrustVC](./oa_to_trustvc.md#step-3-sign-with-trustvc) of the migration guide. The only addition is `.inlineTemplate()`, called before `.sign()`:

```typescript
import { compressTemplate } from '@trustvc/trustvc';

const html = `
  <div class="cert">
    <h1>Certificate</h1>
    <p>Awarded to: <span data-field="name"></span></p>
    <p>Course: <span data-field="course"></span></p>
  </div>
`;
const css = '.cert { font-family: sans-serif; } .cert h1 { color: navy; }';

const compressed = await compressTemplate({
  templateName: 'CERTIFICATE',
  html,
  css,
});

// `builder` already has credentialSubject() set, as in the migration guide.
builder.inlineTemplate(compressed);

const signed = await builder.sign(didKeyPairs, 'ecdsa-sd-2023', {
  mandatoryPointers: ['/renderMethod'],
});
```

`data-field` sets an element's text content from `credentialSubject`; `data-field-src` does the same for an `<img>`'s `src`. Values are never parsed as HTML, so a `credentialSubject` value cannot inject markup. See [Using Any Template](https://docs.trustvc.io/docs/how-tos/inline-html-renderer/using-any-template) for the full binding reference, including `data-repeat` for lists.

## Rendering a Certificate's Inline Template

```typescript
import {
  decompressInlineTemplate,
  getRenderMethods,
  renderInlineTemplate,
  verifyDocument,
} from '@trustvc/trustvc';

const fragments = await verifyDocument(signedDocument);
// ...check fragments are valid, then:

const { inlineTemplate } = getRenderMethods(signedDocument);
if (inlineTemplate) {
  const doc = await decompressInlineTemplate(signedDocument);
  renderInlineTemplate(doc, hostElement);
}
```

`renderInlineTemplate` mounts the filled template in a sandboxed `srcdoc` iframe with no `allow-scripts` and a strict Content Security Policy — template HTML is issuer-controlled and treated as untrusted, so nothing in it can execute.

## Additional Resources

- [TrustVC Documentation — Inline HTML Renderer Overview](https://docs.trustvc.io/docs/how-tos/inline-html-renderer/overview)
- [TrustVC Documentation — Inline HTML Renderer Tutorial](https://docs.trustvc.io/docs/tutorial/inline-html-renderer)
- [OA to TrustVC Migration Guide](./oa_to_trustvc.md)
