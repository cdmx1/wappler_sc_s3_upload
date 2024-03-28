const { S3 } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

exports.aws_s3_signed_upload = async function (options) {
    const Bucket = this.parseRequired(options.bucket, 'string', 'Bucket is required.');
    const Key = this.parseRequired(options.key, 'string', 'Key is required.');
    const ContentType = this.parseOptional(options.contentType, 'string', mime.lookup(Key) || 'application/octet-stream');
    const expiresIn = this.parseOptional(options.expires, 'number', 300);
    const ACL = this.parseOptional(options.acl, 'string', undefined);
    const accessKeyId = this.parseRequired(options.accessKeyId, 'string', 'AccessKeyId is required.');
    const secretAccessKey = this.parseRequired(options.secretAccessKey, 'string', 'SecretAccessKey is required.');
    const region = this.parseOptional(options.region, 'string', 'us-east-1');
    const endpoint = `s3.${region}.amazonaws.com`;
    const s3 = new S3({ endpoint: 'https://' + endpoint, credentials: { accessKeyId, secretAccessKey }, region, signatureVersion: 'v4' });
    const command = new PutObjectCommand({ Bucket, Key, ContentType, ACL });
    return getSignedUrl(s3, command, { expiresIn });
}

exports.aws_s3_signed_download = async function (options) {
    const Bucket = this.parseRequired(options.bucket, 'string', 'Bucket is required.');
    const Key = this.parseRequired(options.key, 'string', 'Key is required.');
    const expiresIn = this.parseOptional(options.expires, 'number', 300);
    const accessKeyId = this.parseRequired(options.accessKeyId, 'string', 'AccessKeyId is required.');
    const secretAccessKey = this.parseRequired(options.secretAccessKey, 'string', 'SecretAccessKey is required.');
    const region = this.parseOptional(options.region, 'string', 'us-east-1');
    const endpoint = `s3.${region}.amazonaws.com`;
    const s3 = new S3({ endpoint: 'https://' + endpoint, credentials: { accessKeyId, secretAccessKey }, region, signatureVersion: 'v4' });
    const command = new GetObjectCommand({ Bucket, Key });
    return getSignedUrl(s3, command, { expiresIn });
}