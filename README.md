# Wappler Server Connect: Custom S3 Operations

## Overview

This suite of S3 actions allows you to interact with Amazon S3 or custom S3 providers through Wappler's Server Connect. These actions enable you to:

1. Upload files to S3 with a signed URL (Custom S3 Signed Upload).
2. Download files from S3 using a signed URL (Custom S3 Signed Download).
3. Put a file into an S3 bucket (Custom S3 Put File).
4. Put multiple files into an S3 bucket (Custom S3 Multiple Files Upload).

## Features

- Interact with both AWS S3 and custom S3 providers.
- Generate signed URLs for secure file uploads and downloads.
- Upload single or multiple files to an S3 bucket with optional custom endpoints.
- Support for path-style and virtual-hosted style URLs.
- Flexible key generation for multiple file uploads (increment, timestamp, original filename, or custom).
- Leverage server-bound credentials for S3, enabling switching between different credentials per request.

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

This action uploads a single file to an S3 bucket.

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
- **Use File Path**: If enabled, treats the file name as a file path instead of a form upload name.

##### S3 Credentials
- **Access Key ID** (required): Your S3 provider's access key ID.
- **Secret Access Key** (required): Your S3 provider's secret access key.
- **Region**: The region for your S3 provider (default: `us-east-1`).

##### Output
- **Output**: If enabled, the output includes information about the uploaded file.

#### Returns
The action returns information about the uploaded file.

---

### `Custom S3 Multiple Files Upload`

This action uploads multiple files to an S3 bucket with flexible key generation options.

#### Parameters

##### S3 Details
- **Provider** (required): Select the S3 provider. Options include:
  - `AWS`: Use AWS S3.
  - `Custom`: Use a custom S3 provider (requires an endpoint).
- **Name** (required): The name used in the output.
- **Bucket** (required): The name of the S3 bucket.
- **Base Key**: (optional) A prefix/path to prepend to all file keys (e.g., `uploads/2025/`).
- **Key Pattern**: (optional) How to generate the key for each file. Options:
  - `filename` (default): Use the original filename for each file.
  - `increment`: Use an incrementing number for each file (e.g., `baseKey1`, `baseKey2`, ...).
  - `timestamp`: Use a timestamp for each file (e.g., `baseKey1687260000000`).
- **Files** (required): An array of file objects. Each object can have:
  - `file` (required): The file input name or file path.
  - `key` (optional, for custom pattern): Custom key for the file.
  - `contentType` (optional): Content type for the file.
  - `contentDisposition` (optional): Content disposition for the file.
- **Custom Endpoint**: Custom endpoint for the upload.
- **Force Path Style**: Force path-style URL (default: false).
- **Use File Path**: If enabled, treats file names as file paths instead of form upload names.

##### S3 Credentials
- **Access Key ID** (required): Your S3 provider's access key ID.
- **Secret Access Key** (required): Your S3 provider's secret access key.
- **Region**: The region for your S3 provider (default: `us-east-1`).

##### Output
- **Output**: If enabled, the output includes information about all uploaded files.

#### Key Generation Examples

- **Base Key + Increment**:
  - `baseKey`: `uploads/2025/`
  - `keyPattern`: `increment`
  - Resulting keys: `uploads/2025/1`, `uploads/2025/2`, ...

- **Base Key + Timestamp**:
  - `baseKey`: `uploads/2025/`
  - `keyPattern`: `timestamp`
  - Resulting keys: `uploads/2025/1687260000000`, ...

- **Base Key + Original Filename**:
  - `baseKey`: `uploads/2025/`
  - `keyPattern`: `filename`
  - Resulting keys: `uploads/2025/photo.jpg`, `uploads/2025/doc.pdf`, ...

- **Custom Key (per file)**:
  - `keyPattern`: `custom`
  - Each file object can specify its own `key` property, which will be used as the S3 key (with `baseKey` prepended if provided).

#### Returns
The action returns an array of results, one for each file uploaded, including the S3 URL, bucket, key, and original file name.

#### Example Usage

```js
{
  baseKey: "uploads/2025/",
  keyPattern: "increment",
  files: [
    { file: "photo.jpg" }, // uploads/2025/1
    { file: "doc.pdf" }    // uploads/2025/2
  ],
  bucket: "my-bucket",
  accessKeyId: "...",
  secretAccessKey: "...",
  region: "us-east-1"
}
```
