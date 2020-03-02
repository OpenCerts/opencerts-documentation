---
id: status
title: Status
sidebar_label: Status
---

In the event you want to provide information on the certificate that there exists an updated version of it, you can make use of the [Status API](https://github.com/Open-Attestation/terraform-aws-status-api). Such case might happen when information that was provided on a certificate are gone stale, or that new information are available. For instance, as a university, you might want to provide certificate during mid-year with partial transcripts data, and then at the end of the year you might want to provide all transcripts data in the certificate.

## Principle

In order to integrate the Status API, collaboration will be necessary between some parts of the system. We will use the target hash embedded within wrapped certificate to uniquely identity them.

> To get the target hash of a certificate, open a wrapped certificate and extract the value from the `signature.targetHash` field

![Status API](/img/docs/api/status/overview.png)

1. The target hash of each document must be stored somewhere (for instance in a database) along the data.
1. During the process that wraps documents, for each document:
    1. Call the Status API using the previous target hash, and set the status to `1` (let's assume that one means the document is stale).
    1. Save the new target hash into your database.
1. In the template renderer, call the Status API using the target hash of the provided document and display a message if the status is `1`. Hence when users will verify the certificate in OpenCerts, they will see a message if the document is stale.

> Using `1` as a value for stale document is just for explanation purposes. You are free to use the value(s) you want.

## Deployment

We provide a [terraform module](https://github.com/Open-Attestation/terraform-aws-status-api) to help you deploy the API on AWS.

> While terraform can help you to deploy on any cloud platform, the code of the API is highly dependant to AWS.

## Usage

### Adding/Updating a status
In the example that follows, we will set the status value to `1` for a document identified by the `abcd` target hash:
```bash
curl --location --request POST 'https://<API_URL>/abcd' \
--header 'Content-Type: application/json' \
--header 'x-api-key: <API_KEY>' \
--data-raw '{
	"status": 1
}'
```
where:
- `<API_URL>` is the full URL to your deployed API.
- `abcd` is the target of the document to change the status **not** prepend with 0x.
- `<API_KEY>`: is the API key to protect your API.

The response to this call will look like:
```json
{
  "id":"abcd",
  "status":1,
  "timestamp":1583395314532
}
```

### Getting the status of a document
In the example that follows we will retrieve the current status for a document identified by the `abcd` target hash:
```bash
curl --location --request GET 'https://<API_URL>/abcd' \
--header 'Content-Type: application/json' \
--header 'x-api-key: <API_KEY>'
```
where:
- `<API_URL>` is the full URL to your deployed API.
- `abcd` is the target of the document to change the status **not** prepend with 0x.
- `<API_KEY>`: is the API key to protect your API.

```json
{
  "status": 1,
  "events": [
    {
      "id": "abcd",
      "status": 1,
      "timestamp": 1583395314532
    }
    // eventually older events
  ]
}
```

> If you provide a non-existing target hash, the response will return a default status with the value `0`

## Additional information
- You can find an example of use of the API in [ACRA renderer](https://github.com/OpenCerts/acra-decentralized-renderer/blob/master/src/templates/core/headers.tsx#L80)
