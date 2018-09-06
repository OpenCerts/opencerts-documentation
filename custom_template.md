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

## Folder Structure

All the certificate templates are stored in the folder `/components/CertificateTemplates/`. Institutes adding new templates will store their template files in the path `/components/CertificateTemplates/<Institute Name>-<Template Name>`. 

For example, University of Blockchain might have the following folders for two different types of degree program: 

- `/components/CertificateTemplates/UniversityOfBlockchain-Bachelor`
- `/components/CertificateTemplates/UniversityOfBlockchain-Master`
- `/components/CertificateTemplates/UniversityOfBlockchain-Doctorate`

## Registering Templates

To allow the OpenCerts viewer to detect the new certificate templates, you will have to register all the new templates in the file `/components/CertificateTemplates/index.js`

For example, to add the 3 new templates by University Of Blockchain, simply append the 3 lines into the exported templates.

```js
import DefaultCert from "./Default";
import UniversityOfBlockchain_Bachelor from "./UniversityOfBlockchain-Bachelor";
import UniversityOfBlockchain_Master from "./UniversityOfBlockchain-Master";
import UniversityOfBlockchain_Doctorate from "./UniversityOfBlockchain-Doctorate";

const templates = {
  default: DefaultCert,
  "UniversityOfBlockchain_Bachelor": UniversityOfBlockchain_Bachelor,
  "UniversityOfBlockchain_Master": UniversityOfBlockchain_Master,
  "UniversityOfBlockchain_Doctorate": UniversityOfBlockchain_Doctorate
};

export default templates;
```

## Template Index

In each template folder, there will be the `index.js` file to export an array of all the different views for the certificate. 

For example:

```js
import CertificateView from "./certificate";
import TranscriptView from "./transcript";

const entry = [
  {
    id: "certificate",
    label: "Certificate",
    template: CertificateView
  },
  {
    id: "transcript",
    label: "Transcript",
    template: TranscriptView
  }
];

export default entry;

```

In the example above, all certificates rendered using this template will have two views, namely `Certificate` and `Transcript` view. 

These two views are imported from the template `./certificate` and `./transcript` respectively.

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

const Template = certificate => {
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