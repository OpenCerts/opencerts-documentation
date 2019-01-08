# Custom Templates for Certificates

![Certificate Data plus React Template equal Certificate Views](./assets/custom-templates/overview.png)

OpenCerts.io is able to render any certificate with data that follows the JSON schema specification using the default template. The default template will render all the issuer and recipient information, certificate name, and transcript information. 

Issuers who would like to customise the looks of the certificates they issue may customise how their certificates is rendered using custom templates. They may also include multiple views of the same certificate if they wish. 

In practice, institutes usually issue two or more types of certificate upon graduation of a student. With multiple views, one OpenCerts file could be used to render multiple different types of views such as the Graduation Certificate, Education Transcript, Co-curriculum Activities Transcript, etc. 

To customise the certificate views, the institute will have to include their rendering template (written in [React.js](https://reactjs.org/)) in the OpenCerts.io's [website Github repository](https://github.com/GovTechSG/opencerts-website).

## Setup

### Prerequisite

- git
- node.js
- yarn

### Running the website locally
```bash
# Clone the repository
git clone https://github.com/GovTechSG/opencerts-website.git
cd opencerts-website

# Install dependencies
npm install

# Run the server
yarn dev

# Open website served at localhost:3000
open http://localhost:3000
```

## Template Directory Structure

All the certificate templates are stored in the folder `/components/CertificateTemplates/`. Institutes adding new templates will store their template files in the path derived from their institute's official domain name. The derivation is simply using [reverse domain name notation](https://en.wikipedia.org/wiki/Reverse_domain_name_notation) as a prefix.

| Organisation                      | Domain Name          | Directory Structure                       |
|-----------------------------------|----------------------|-------------------------------------------|
| GovTech                           | tech.gov.sg          | /sg/gov/tech/TEMPLATE_DESCRIPTOR          |
| Ngee Ann Polytechnic              | np.edu.sg            | /sg/edu/np/TEMPLATE_DESCRIPTOR            |
| Singapore Institute of Technology | singaporetech.edu.sg | /sg/edu/singaporetech/TEMPLATE_DESCRIPTOR |

Additionally, we recommend prefixing the template descriptor with the year so as to allow updating templates on at least an annual basis. For example, `/sg/gov/tech/2018-OpenCertsAssociate` or `/sg/gov/tech/2018-12-OpenCertsAssociate`

## Registering Templates

To allow the OpenCerts viewer to detect the new certificate templates, the value used in the `$template` field must be present in the object exported by `/components/CertificateTemplates/index.js`. The key-value pair must be exported from your organisation's folder's index.js and be propagated upwards. This key-value pair __MUST NOT__ be a duplicate of another existing template's key. The directory structure will be part of the `$template` field, for example: `$template: "/sg/gov/tech/2018-OpenCertsAssociate"`

## Organisation Index

To provide a performant user experience, we have optimised the OpenCerts build process to only load templates that are relevant to the certificate that was loaded into the viewer. For this process to work, each template must be registered in a specific manner.

Under your organisation's template directory, there should be an index.js that exports your templates accordingly:

```javascript
import dynamic from "next/dynamic";

const OpenCertsAssociate2018 = dynamic(
  import("./2018-OpenCertsAssociate" /* webpackChunkName: "GovTechTemplates" */)
);
const OpenCertsAssociate2019 = dynamic(
  import("./2019-OpenCertsAssociate" /* webpackChunkName: "GovTechTemplates" */)
);

export default {
  "2018-OpenCertsAssociate": OpenCertsAssociate2018,
  "2019-OpenCertsAssociate": OpenCertsAssociate2019
};
```

Ensure that the value for `webbpackChunkName` is the same across all your templates to ensure that they are all bundled together in the build output.

For each individual template, add it to the exports with the `TEMPLATE_DESCRIPTOR` value as the key in the exported object.


## Writing Certificate Templates

The template files are written in [React.js](https://reactjs.org/) and inherits CSS properties from the [bootstrap framework](https://getbootstrap.com).

In short, you can use certificate data from the `props` passed into the exported function and style the document as you would with bootstrap classes.

In the sample template below you can see how:

- data from the certificate is made available to the template
- objects in an array can be rendered
- conditional rendering of components

Sample Template:

```js
import { get } from "lodash";

const Template = ({ certificate }) => {
  // Declaring what variables will be available to the template from the certificate
  const certificateName = get(certificate, "name");
  const certificateId = get(certificate, "id");
  const issuedOn = get(certificate, "issuedOn");
  const expiresOn = get(certificate, "expiresOn");
  const admissionDate = get(certificate, "admissionDate");
  const graduationDate = get(certificate, "graduationDate ");

  const recipientName = get(certificate, "recipient.name");
  const recipientDid = get(certificate, "recipient.did");
  const recipientEmail = get(certificate, "recipient.email");
  const recipientPhone = get(certificate, "recipient.phone");

  const issuerName = get(certificate, "issuers.0.name");
  const issuerAddress = get(certificate, "issuers.0.certificateStore");
  const issuerUrl = get(certificate, "issuers.0.url");
  const issuerEmail = get(certificate, "issuers.0.email");
  const issuerDid = get(certificate, "issuers.0.did");

  const transcriptData = get(certificate, "transcript", []);
  
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

## Template's index.js

In each template folder, there will be the `index.js` file that describes the views present in the template. 

An example of a template with a certificate and transcript view:

```js
import PropTypes from "prop-types";
import { approvedAddresses } from "../common";
import GovTechCert from "./certificate";
import GovTechTranscript from "./transcript";
import { MultiCertificateRenderer } from "../../../../../MultiCertificateRenderer";

const templates = [
  {
    id: "certificate",
    label: "Certificate",
    template: GovTechCert
  },
  {
    id: "transcript",
    label: "Transcript",
    template: GovTechTranscript
  }
];

const GovTechCert = ({ certificate }) => (
  <MultiCertificateRenderer
    certificate={certificate}
    templates={templates}
    whitelist={approvedAddresses}
  />
);

GovTechCert.propTypes = {
  certificate: PropTypes.object.isRequired
};

export default GovTechCert;
```

In the example above, all certificates rendered using this template will have two views, namely `Certificate` and `Transcript` view. 

These two views are imported from the template `./certificate` and `./transcript` respectively, and rendered by the `<MultiCertificateRenderer>` component.


## Address whitelisting

If a whitelist of addresses is provided with the template, then only certificates issued from these contract store addresses will be able to use this certificate. This is to mitigate the possibility of an unauthorised issuer issuing a certificate using your `$template` value, and masquerading as a certificate from your institution.

If no whitelist is provided, anyone can use your certificate template.

## Coding standards

The team is currently using `eslint` to ensure consistency of the coding standards in the repository. 

Prior to submitting a pull request, be sure to run `yarn lint --fix` or `npm run lint --fix`. 

Kindly fix all the errors and warnings flagged by eslint. 

## Submitting your changes

Once you have added the template for your certificates, check your code against our [pull request checklist](./appendix_pull_request_checklist.md).

Once you have review your code change against the checklist, you can submit a pull request to our maintainer. A complete guide is available at [https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/](https://akrabat.com/the-beginners-guide-to-contributing-to-a-github-project/)

## Good Practices

### Refactor your templates

One of the most common issues is repeated code. These components can be functions, constants, and even segments of the templates. 

Try to refactor the common components of the template files to a common folder if necessary.

### Private data

Do take note that the source code of the website is publicly available. Be sure to leave out any private data such as personnel's signatures, access tokens and secret keys.

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
