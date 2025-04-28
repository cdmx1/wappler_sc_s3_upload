# AWS S3 Signed Upload

## Overview
This functionality enables the generation of signed URLs for uploading files to an Amazon S3 bucket securely. Signed URLs are URLs for objects in S3 that are valid for a limited time and can be used to upload files directly to S3 without requiring the uploader to have AWS credentials.

Now supports uploading the file from the server-side

## Usage
### S3 Details
- **Bucket**: Enter the name of the S3 bucket where the file will be uploaded.
- **Key**: Enter the key for the object in S3.
- **Expires In (seconds)**: Enter the expiration time for the signed URL in seconds. Defaults to 300 seconds (5 minutes).
- **ACL**: Enter the Access Control List (ACL) for the object. If not provided, ACL will not be set.

### AWS Credentials
- **Access Key ID**: Enter the AWS access key ID.
- **Secret Access Key**: Enter the AWS secret access key.
- **Region**: Enter the AWS region. Defaults to 'us-east-1'.
