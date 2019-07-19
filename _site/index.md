<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
/>
<link rel="stylesheet" href="./search.css">

![OpenCerts Logo](./assets/logo.png)

# OpenCerts Documentation

<div class="searchbox algolia-autocomplete ds-dropdown-menu">
  <input type="text" placeholder="Search the docs..." aria-label="Search">
</div>

## Resources

- [01/10/18 - Technical Training Slides](https://docs.google.com/presentation/d/11QTk76_R_FRc5xrgLrkG-NjsIItYDNcLWG6RgiICm48/edit?usp=sharing)
- [27/03/19 - Announcements & FAQ](https://docs.google.com/presentation/d/11VDgcPOrhDsXWs_1fVghj138ZxonEDpC-UE39Mx4E30)
- [12/04/19 - OpenCerts Schema 1.5 update](./announcements/schema1.5.pdf)
- [19/07/19 - OpenCerts Schema 2.0 update](./schema2_update.md)

## Table of Content

### Issuing and Customising OpenCerts

| Steps                                                                             | OpenCerts v1.5 | OpenCerts v2.0 |
| --------------------------------------------------------------------------------- | :------------: | :------------: |
| [Creating Certificates](./creating_certificates.md)                               |       ✅       |       ✅       |
| [Deploying Certificate Store](./deploying_store.md)                               |       ✅       |       ✅       |
| [Creating a Document Renderer](./document_renderer.md)                            |                |       ✅       |
| [Testing a Document Renderer](./document_renderer_test.md)                        |                |       ✅       |
| [Custom Certificate Templates for OpenCerts v2](./custom_template_v2.md)          |                |       ✅       |
| [Custom Certificate Templates](./custom_template.md)                              |       ✅       |                |
| [Testing Custom Certificate Templates](./integration_test.md)                     |       ✅       |                |
| [Batching Certificates](./batching_certificates.md)                               |       ✅       |       ✅       |
| [Issuing Certificates](./issuing_certificates.md)                                 |       ✅       |       ✅       |
| [Issuing Certificates (Using MultiSig Wallet)](./issuing_multisig_certificate.md) |       ✅       |       ✅       |
| [Identity Registry](./identity_registry.md)                                       |       ✅       |       ✅       |

### Appendix

- [Appendix: Test Wallet/Ethers](./appendix_test_accounts.md)
- [Appendix: Sample Certificate / Custom Template (WIP)](./appendix_samples.md)
- [Appendix: Data Obfuscation](./appendix_data_obfuscation.md)
- [Appendix: Ledger Nano S Initialisation](./appendix_ledgerinit.md)
- [Appendix: Pull Request Checklist](./appendix_pull_request_checklist.md)
- [Appendix: Pull Request Preview](./appendix_pull_request_preview.md)
- [Appendix: Verifying the Certificate Store Contract](./verifying_contract.md)

### Developing Your Own Product with OpenCerts

- Verifier (TBD)
- [Embedded Certificate Renderer (WIP)](./embedded_viewer.md)
- Transfer (TBD)

## Mailing Lists

### For Managers

[http://eepurl.com/gk_OM5](http://eepurl.com/gk_OM5)

This is a channel where the managing staffs behind OpenCerts can reach out to you regarding:

- Consortium meetings
- Meeting updates
- Strategic updates

### For Developers

[http://eepurl.com/gk_D3v](http://eepurl.com/gk_D3v)

This is a channel where the core developers behind OpenCerts can reach out to you regarding:

- New features
- Best practice for development
- Breaking changes

## Getting Help

If there is any issue that is not addressed in this document, kindly [create an issue on this Github repository](https://github.com/GovTechSG/opencerts-documentation/issues).

<script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"></script>
<script>
// Run the command below in the terminal to UPDATE SEARCH
// ALGOLIA_API_KEY='3ae9a6bbd0e6106dedefda9de3720d34' bundle exec jekyll algolia
  docsearch({
    apiKey: '056213421be11efac77405cf958ade15',
    indexName: 'opencerts-documentation',
    appId: 'S3C08S8B4J', // Should be only included if you are running DocSearch on your own.
    inputSelector: 'input',   // Replace inputSelector with a CSS selector matching your search input
    debug: true, // Set debug to true if you want to inspect the dropdown
  });
</script>
