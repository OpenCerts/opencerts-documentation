---
id: linkedin
title: Share certificate on Linkedin
sidebar_label: Linkedin
---

OpenCerts certificates are plain text files. Unfortunately, platforms like Linkedin don't know how to handle such files, and they don't provide the users a simple way to share them.

The good news is that even if it requires some manual setup, it's possible to share your certificates.

## Process

The process to share your certificate can be summed up as follows:
- encrypt your certificate
- host/deploy your encrypted certificate somewhere (i.e., your certificate must be accessible from a URL)
- create a specific link that will open your certificate on Opencerts
- share the link on Linkedin

Let's dive into the different steps.

## 1. Encrypt your certificate:

When you need to share your certificate online and, specifically, when you need to host it somewhere (see next step), we always recommend that you encrypt your certificate.

A certificate may contain Personally Identifiable Information (PII), and you should always be cautious about how you share this information.

To encrypt your certificate, you can use [our online encryption tool](https://toolkit.openattestation.com/encrypt-decrypt).

Paste your certificate on the left panel, regenerate a key if you wish (at the bottom of the left panel), and click on the encrypt button.

Save the encrypted certificate on the right panel to a local file. You can name the file `certificate.opencert` for instance. The name doesn't matter.

Save the key you used to encrypt your certificate by clicking on the copy button. You must keep the key somewhere for a coming step.

**At the end of this step, you should have two elements: an encrypted certificate, and a key.** The key serves to decrypt the certificate. If you lose it, you will never be able to decrypt your certificate.

## 2. Host your encrypted certificate

This step is pretty straightforward. You need to make your encrypted certificate available from a URL, for instance, like [this demo certificate](https://gist.githubusercontent.com/Nebulis/f4104cc87ce2ce7383304025c8382295/raw/a3dc361082e0f8ea07a8711e4e873eb11b7f6baf/certificate.json).

You can choose any method, any service, as long as the final URL returns the encrypted certificate.

As of today, we don't provide any service, but, if you don't know any, you can use the following ones:
- [Github Gist](https://gist.github.com/)
- [Pastebin](https://pastebin.com/)

**At the end of this step, you should have two elements: a URL to your encrypted certificate, and a key.**

## 3. Create a link to Opencerts

Opencerts can load certificates hosted anywhere, encrypted or not, automatically. All you have to do is create a specific link to Opencerts, with the URL to your certificate and the key to decrypt it.

You can use our [online tool](https://toolkit.openattestation.com/action-creator) to create the shareable link:
- Put `https://www.opencerts.io/` in the `verifier` field
- Paste the link to your certificate (step 2) in the `Document URL` field
- Paste your key (step 1) in the `key` field
- Click on the create button and copy the generated URL

You can directly try to open the generated URL into your browser. It should load `opencerts.io` and then you should be able to see your certificate. You can now share your link on Linkedin.

## Note on encryption

Please note that once someone has access to your shareable link, he will have access to all the information inside the certificate, because the key to decrypt it is part of the link. If you don't care about who access your certificate, you don't need to encrypt it, and you can skip step 1. However, we always advise you to encrypt your document.

If you want to share your certificate, but want to hide information that may not be relevant, or that are too sensitive to share (for instance your NRIC), you can redact it before step 1 with our [online tool](https://privacy-filter.netlify.app/)
