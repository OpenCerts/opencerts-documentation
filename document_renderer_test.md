# Integration Test

Integration tests are added to the document renderer to ensure that incremental changes made to the renderer's repository (whether by core developers or other template developers) do not break your certificates.

## Running the integration test (visually)

![Running Integration Test](./assets/integration-test/running_test.png)

To run the integration test to see how the test navigates around the application, simply run the web application AND the integration test in two separate shells.

Running the web application

```sh
yarn start
```

Running the integration test (with chrome)

```sh
npm run integration
```

## Running the integration test (headless, on built application)

The code is automatically tested using on Travis. The application is first built and then the integration test will run in the headless (no browser UI) mode. The command to replicate the same test process is:

```sh
npm run integration:headless
```

\* The full travis script can be found in the file `.travis.yml` in the document-renderer repository.

## Writing the integration test

The integration test is written with [TestCafe](https://devexpress.github.io/testcafe/), in javascript. You may refer to the [Getting Started](https://devexpress.github.io/testcafe/documentation/getting-started/) guide by TestCafe to get started or when in doubt.

### File Structure

![Folder Structure](./assets/integration-test/folder_structure.png)

Integration test files in the repository have `.spec.js` file extensions. These will be picked up and run by testcafe automatically.

We recommend having the test file in the same place as the template file, together with a corresponding sample of the `.opencert/.json` file.

### Code Stucture

Below is a sample code for testing our OpenCerts demo certificate with three template tabs - the certificate, transcript, and media.

The test checks for the presence of specific text that are rendered with the certificate template. You may include test for other aspects of the certificate not limited to the presence of text.

```javascript
import { Selector } from "testcafe";
import { readFileSync } from "fs";
import { join } from "path";
import { getData } from "@govtechsg/open-attestation";

fixture("Frameless Viewer").page`http://localhost:3000/`;

const Certificate = "./Ropsten-Demo.json";
const RenderedCertificate = Selector("#rendered-certificate");
const Media = Selector("#youtube-vid");

const validateTextContent = async (t, component, texts) =>
  texts.reduce(
    async (_prev, curr) => t.expect(component.textContent).contains(curr),
    Promise.resolve()
  );

test("Govtech Demo certificate is rendered correctly", async t => {
  // Inject javascript and execute window.openAttestation.renderDocument
  const certificateContent = getData(
    JSON.parse(readFileSync(join(__dirname, Certificate)).toString())
  );
  await t.eval(
    () => window.openAttestation.renderDocument(certificateContent),
    {
      dependencies: { certificateContent }
    }
  );

  // Check content of window.openAttestation.templates
  await t.wait(500);
  const templates = await t.eval(() => window.openAttestation.getTemplates());
  await t
    .expect(templates)
    .eql([
      { id: "certificate", label: "Certificate", template: undefined },
      { id: "transcript", label: "Transcript", template: undefined },
      { id: "media", label: "Media", template: undefined }
    ]);

  // Validate content of first tab
  await validateTextContent(t, RenderedCertificate, [
    "This is to certify that",
    "Your Name",
    "has successfully completed the",
    "OpenCerts Demo",
    "certification through training administered by"
  ]);

  // Navigate to next tab using window.openAttestation.selectTemplateTab
  await t.eval(() => window.openAttestation.selectTemplateTab(1));

  // Validate content of second tab
  await validateTextContent(t, RenderedCertificate, [
    "CS 1110",
    "Introduction to Programming",
    "SXXXXXXXY",
    "53b75bbe"
  ]);

  // Navigate to next tab using window.openAttestation.selectTemplateTab
  await t.eval(() => window.openAttestation.selectTemplateTab(2));

  // Validate content of third tab
  await t.wait(1000);
  await t.expect(Media.visible).ok();
});
```
