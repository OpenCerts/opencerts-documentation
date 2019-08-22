# Custom Templates for Certificates (OpenCerts v2)

![Certificate Data plus React Template equal Certificate Views](./assets/custom-templates/overview.png)

OpenCerts.io is able to render any certificate with data that follows the JSON schema specification using the default template. The default template will render all the issuer and recipient information, certificate name, and transcript information.

Issuers who would like to customise the looks of the certificates they issue may customise how their certificates is rendered using custom templates. They may also include multiple views of the same certificate if they wish.

In practice, institutes usually issue two or more types of certificate upon graduation of a student. With multiple views, one OpenCerts file could be used to render multiple different types of views such as the Graduation Certificate, Education Transcript, Co-curriculum Activities Transcript, etc.

## Setup

### Document Renderer

With OpenCerts v2, the institute will have to include their rendering template (written in [React.js](https://reactjs.org/)) in their [hosted document renderer repository](./document_renderer.md).

Make sure to follow the step-by-step guide in the document renderer documentation first!

## Writing Certificate Templates

The template files are written in [React.js](https://reactjs.org/) and all CSS styling is up to you.

In the sample template below you can see how:

- data from the certificate is made available to the template
- objects in an array can be rendered
- conditional rendering of components

Sample Template:

```js
import { get } from "lodash";
import "./demoStyles.css"; // Import your own CSS styles and include it in the html className

const Template = ({ document }) => {
  // Declaring what variables will be available to the template from the certificate
  const certificateName = get(document, "name");
  const certificateId = get(document, "id");
  const issuedOn = get(document, "issuedOn");
  const expiresOn = get(document, "expiresOn");
  const admissionDate = get(document, "admissionDate");
  const graduationDate = get(document, "graduationDate ");

  const recipientName = get(document, "recipient.name");
  const recipientDid = get(document, "recipient.did");
  const recipientEmail = get(document, "recipient.email");
  const recipientPhone = get(document, "recipient.phone");

  const issuerName = get(document, "issuers.0.name");
  const issuerAddress = get(document, "issuers.0.certificateStore");
  const issuerUrl = get(document, "issuers.0.url");
  const issuerEmail = get(document, "issuers.0.email");
  const issuerDid = get(document, "issuers.0.did");

  const transcriptData = get(document, "transcript", []);

  // Rendering an array of transcript data
  const transcriptSection = transcriptData.map((t, i) => (
    <tr key={i}>
      <td>{t.courseCode}</td>
      <td>{t.name}</td>
      <td>{t.grade}</td>
      <td>{t.courseCredit}</td>
    </tr>
  ));

  return (
    <div className="container">
      <div className="row">
        <h1>{certificateName}</h1>
      </div>
      <div className="row mb-4">
        <div className="w-100">
          {certificateId && `Serial: ${certificateId}`}
        </div>
        <div className="w-100">{issuedOn && `Issued On: ${issuedOn}`}</div>
        <div className="w-100">{expiresOn && `Expires On: ${expiresOn}`}</div>
        <div className="w-100">
          {admissionDate && `Admission Date: ${admissionDate}`}
        </div>
        <div className="w-100">
          {graduationDate && `Graduation Date: ${graduationDate}`}
        </div>
      </div>
      <div className="row mb-4">
        <div className="col p-0">
          <h3>Recipient Info</h3>
          {recipientDid && <div>DID: {recipientDid}</div>}
          {recipientName && <div>Name: {recipientName}</div>}
          {recipientEmail && <div>Email: {recipientEmail}</div>}
          {recipientPhone && <div>Phone: {recipientPhone}</div>}
        </div>
        <div className="col p-0">
          <h3>Issuer Info</h3>
          {issuerAddress && <div>Certificate Store: {issuerAddress}</div>}
          {issuerDid && <div>DID: {issuerDid}</div>}
          {issuerName && <div>Name: {issuerName}</div>}
          {issuerUrl && <div>Url: {issuerUrl}</div>}
          {issuerEmail && <div>Email: {issuerEmail}</div>}
        </div>
      </div>
      // Rendering of transcript data if available
      {transcriptData !== [] && (
        <div className="row mb-4">
          <h3>Transcript</h3>
          <table className="w-100">
            <tbody>
              <tr>
                <th>Course Code</th>
                <th>Name</th>
                <th>Grade</th>
                <th>Course Credit</th>
              </tr>
              {transcriptSection}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Template;
```

## Integration test

To ensure that incremental code change does not break your certificate, each template should be accompanied by it's integration test.

Details on the integration test can be found in [testing your document renderer](./document_renderer_test.md).

## Common Questions

### Rendering Logic

As the template is written in javascript, you can use custom application logic to render the certificates.

One such example is to group modules in the same semester together.

Do note that the [lodash](https://lodash.com) library is available and that functions such as `groupby` might come in useful.

### Additional data

OpenCerts specifies the certificate schema to allow all certificates to be computer readable. However, it is understood that there might be data that cannot be fitted into the existing schema. To include additional data, simply put these additional data into the `additionalData` field in the certificate. These additional data are also made available to the template. However, do note that while it is human readable (via the OpenCerts viewer) it may not be understood by all computers.

Example of custom data:

```js
{
  "id": "2018-05-27382748",
  "$template": "UniversityOfBlockchain-Degree",
  "issuedOn": "2018-08-01T00:00:00+08:00",
  "issuers": [
   {
     "name": "University of Blockchain",
     "certificateStore": "0xAAAAAAAAAAAAAAAA...AAAAAA"
   }
  ],
  "recipient": {
  	"name": "John Toh"
  },
  "name": "Bachelor of Blockchain",
  "additionalData":{
  	"studentId": "U1234567G",
  	"signature1": {
  	  "name": "Mr Tan",
  	  "designation": "Chairman",
  	  "signature": "data:image/jpeg;base64,....."
  	},
  	"signature2": {
  	  "name": "Mrs Low",
  	  "designation": "President",
  	  "signature": "data:image/jpeg;base64,....."
  	}
  }
}
```

### Template data in certificate

There are some occasions where it makes sense to have images in the certificate data. One example of this is for signature fields. These signatures can be added to the certificate data in `base64` format, together with the signer designation and name. This will allow the institute to reuse the template for different departments and not change the template when the signer leaves the office.

See example in Additional Data for a sample of where image of the signature can be inserted.

### Rendering for Mobile

Some of the users will be viewing these certificates from mobile devices, you might want to make sure the template is mobile responsive.

The certificate template could be optimised for mobile using various classes from bootstrap.

### Data obfuscation

OpenCerts allow users to obfuscate values in the document. The API to enable data obfuscation on your custom template can be found [in the appendix](./appendix_data_obfuscation.md).
