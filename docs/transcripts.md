---
id: transcripts
title: OpenCerts Transcripts
sidebar_label: Transcripts
---

In order to create valid OpenCerts transcripts, you need to adhere to [the OpenCerts Schema](https://schema.opencerts.io/transcripts/2.0). In this guide, we will explore how to do it.

# Prerequisite

- Create the following folders:
  - `opencerts-transcripts`
  - `opencerts-transcripts/raw-documents`

```bash
mkdir -p opencerts-transcripts/raw-documents
```

- Download [open-attestation-cli](https://www.openattestation.com/docs/component/open-attestation-cli) for your platform and move it to the previously created `opencerts-transcripts` folder under the name `open-attestation` (don't forget to correctly set the permissions).

> For the rest of this guide, we will assume that every action occur from the `opencerts-transcripts` folder

# Wrapping OpenCerts document

In order to generate wrapped documents, we will use the `wrap` method from the CLI. This method expects 2 arguments: one folder containing the raw documents, and one folder that it will generate the wrapped documents to:

```bash
./open-attestation wrap <path_to_raw_documents_folder> <path_to_generated_wrapped_documents_folder>
```

In addition, we will use the `--schema` option to ensure that our documents are valid OpenCerts documents.

```bash
./open-attestation wrap <path_to_raw_documents_folder> <path_to_generated_wrapped_documents_folder> --schema <url_to_schema>
```

## Creating raw document

Create a document called `opencerts.json` in the `raw-documents` folder with the following content:

```json
{
  "id": "53b75bbe",
  "name": "Govtech Demo Certificate",
  "description": "Govtech Demo Certificate",
  "issuedOn": "2019-05-29T00:00:00+08:00",
  "admissionDate": "2017-08-01T00:00:00+08:00",
  "graduationDate": "2022-08-01T00:00:00+08:00",
  "$template": {
    "name": "GOVTECH_DEMO",
    "type": "EMBEDDED_RENDERER",
    "url": "https://demo-renderer.opencerts.io"
  },
  "issuers": [
    {
      "name": "Govtech",
      "url": "https://tech.gov.sg",
      "documentStore": "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
      "identityProof": {
        "type": "DNS-TXT",
        "location": "demo.openattestation.com"
      }
    }
  ],
  "recipient": {
    "name": "Your Name",
    "nric": "SXXXXXXXY",
    "course": "Govtech Demo"
  },
  "transcript": [
    {
      "name": "Introduction to Programming",
      "grade": "A+",
      "courseCredit": "3",
      "courseCode": "CS 1110",
      "examinationDate": "2017-12-01T00:00:00+08:00",
      "semester": "1"
    },
    {
      "name": "Object Oriented Programming in Java",
      "grade": "A+",
      "courseCredit": "4",
      "courseCode": "CS 2110",
      "examinationDate": "2017-12-01T00:00:00+08:00",
      "semester": "1"
    },
    {
      "name": "Microeconomics",
      "grade": "A+",
      "courseCredit": "4",
      "courseCode": "ECON 3030",
      "examinationDate": "2018-05-01T00:00:00+08:00",
      "semester": "2"
    },
    {
      "name": "Macroeconomics",
      "grade": "A",
      "courseCredit": "4",
      "courseCode": "ECON 3040",
      "examinationDate": "2018-05-01T00:00:00+08:00",
      "semester": "2"
    },
    {
      "name": "Econometrics",
      "grade": "A-",
      "courseCredit": "4",
      "courseCode": "ECON 3120",
      "examinationDate": "2018-05-01T00:00:00+08:00",
      "semester": "2"
    }
  ],
  "additionalData": {
    "merit": "Y",
    "studentId": "123456",
    "transcriptId": "001"
  }
}
```

> Don't forget to replace `$template.url`, `issuers[0].documentStore` and `issuers[0].documentStore.identityProof.location` as explained in OpenAttestation documentation

## Generating wrapped documents

Let's run the cli over the document:

```bash
❯  ./open-attestation wrap raw-documents --output-dir wrapped-documents --schema https://schema.opencerts.io/transcripts/2.1
✔  success   Batch Document Root: 0xc5507674eb34c36343d0da6a79a76c7967c5f3b1f7642c74ea822e7cff1b8a69
```

- `raw-documents` is a path parameter that points to the folder containing your raw documents.
- `wrapped-documents` is a path parameter that points to the folder that will contain your wrapped documents.

🎉 Congratulations! You successfully created your first valid OpenCerts document which is available is the `wrapped-documents` folder. Feel free to explore the schema to check how to create valid OpenCerts documents with the data you would like to fit in.

The rest of the process to issue your document is as explained in [OpenAttestation documentation](https://www.openattestation.com/docs/verifiable-document/issuing-document).

## Additional information

- Full documentation about the CLI is available on [Github](https://github.com/Open-Attestation/open-attestation-cli)
