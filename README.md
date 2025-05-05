# Wappler Server Connect: Custom S3 Operations

## Overview

This suite of S3 actions allows you to interact with Amazon S3 or custom S3 providers through Wappler's Server Connect. These actions enable you to:

1. Upload files to S3 with a signed URL (Custom S3 Signed Upload).
2. Download files from S3 using a signed URL (Custom S3 Signed Download).
3. Put a file into an S3 bucket (Custom S3 Put File).

## Features

- Interact with both AWS S3 and custom S3 providers.
- Generate signed URLs for secure file uploads and downloads.
- Upload files to an S3 bucket with optional custom endpoints.
- Support for path-style and virtual-hosted style URLs.
- With our custom module, you can leverage server-bound credentials for S3, enabling them to switch between different credentials based on each request.

## Available Actions

### `Custom S3 Signed Upload`

This action generates a signed URL that allows you to upload files to an S3 bucket securely.

#### Parameters

##### S3 Details
- **Provider** (required): Select the S3 provider. Options include:
  - `AWS`: Use AWS S3.
  - `Custom`: Use a custom S3 provider (requires an endpoint).
- **Name** (required): The name used in the output.
- **Bucket** (required): The name of the S3 bucket.
- **Key** (required): The key for the object in S3.
- **Expires In (seconds)**: The expiration time for the signed URL in seconds (default: 300 seconds).
- **Custom Endpoint**: Custom endpoint for the signed URL.
- **Force Path Style**: Force path-style URL (default: false).

##### S3 Credentials
- **Access Key ID** (required): Your S3 provider's access key ID.
- **Secret Access Key** (required): Your S3 provider's secret access key.
- **Region**: The region for your S3 provider (default: `us-east-1`).

##### Output
- **Output**: If enabled, the output includes the signed URL.

#### Returns
The action returns a signed URL for file upload and includes details of the uploaded file.

---

### `Custom S3 Signed Download`

This action generates a signed URL that allows you to securely download files from an S3 bucket.

#### Parameters

##### S3 Details
- **Provider** (required): Select the S3 provider. Options include:
  - `AWS`: Use AWS S3.
  - `Custom`: Use a custom S3 provider (requires an endpoint).
- **Name** (required): The name used in the output.
- **Bucket** (required): The name of the S3 bucket.
- **Key** (required): The key for the object in S3.
- **Expires In (seconds)**: The expiration time for the signed URL in seconds (default: 300 seconds).
- **Custom Endpoint**: Custom endpoint for the signed URL.
- **Force Path Style**: Force path-style URL (default: false).

##### S3 Credentials
- **Access Key ID** (required): Your S3 provider's access key ID.
- **Secret Access Key** (required): Your S3 provider's secret access key.
- **Region**: The region for your S3 provider (default: `us-east-1`).

##### Output
- **Output**: If enabled, the output includes the signed URL.

#### Returns
The action returns a signed URL for file download.

---

### `Custom S3 Put File`

This action uploads a file to an S3 bucket.

#### Parameters

##### S3 Details
- **Provider**: Select the S3 provider. Options include:
  - `AWS`: Use AWS S3.
  - `Custom`: Use a custom S3 provider (requires an endpoint).
- **Name** (required): The name used in the output.
- **Bucket** (required): The name of the S3 bucket.
- **Key** (required): The key for the object in S3.
- **File** (required): The name of the file input field used for file upload.
- **Content Type**: The content type for the file.
- **Content Disposition**: The content disposition for the file.
- **Custom Endpoint**: Custom endpoint for the signed URL.
- **Force Path Style**: Force path-style URL (default: false).

##### S3 Credentials
- **Access Key ID** (required): Your S3 provider's access key ID.
- **Secret Access Key** (required): Your S3 provider's secret access key.
- **Region**: The region for your S3 provider (default: `us-east-1`).

##### Output
- **Output**: If enabled, the output includes information about the uploaded file.

#### Returns
The action returns information about the uploaded file.
