# Appendix - Viewing Certificate Template Locally During Development

For institutes using the legacy renderers prior to v2.0 changes, certificate templates have been moved from the Opencerts-Website repository to the [Legacy-Templates repository](https://github.com/OpenCerts/legacy-templates).

Previously, template developers will have to first issue the certificate before the template could be developed. We have upgraded the experience allow developers to work on unissued certificates to reduce the feedback cycle.

To run the legacy template project:

```
npm install
npm run dev
```

The project will now run at `localhost:3000`. However, that page will be a blank page as certificate data has not been passed into the page.

![File Structure for Legacy Templates](./assets/appendix-viewing-certificates/legacy-file-structure.png)

To do so, we have included a helper html file to help you inject your certificate into the page. You can find the file at `/test/index.html`.

![Certificate Code](./assets/appendix-viewing-certificates/legacy-render-certificate.png)

To do so, we have included a helper html file to help you inject your certificate into the page. You can find the file at `/test/index.html`. You will be able to click on the `Render Certificate` button to render a certificate.

![Certificate Code](./assets/appendix-viewing-certificates/legacy-certificate-to-replace.png)

The test file includes a demo certificate, to develop on your institute's certificate simply change the certificate file to your institute's. Do take note that the `certificate` constants is using the certificate data _prior to batch processing them_.

For details on how to develop the template, continue to refer to the [guide](./custom_template.md).
