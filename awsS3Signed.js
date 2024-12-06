const { S3 } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');

exports.aws_s3_signed_upload = async function (options) {
    const Bucket = this.parseRequired(options.bucket, 'string', 'Bucket is required.');
    const Provider = this.parseRequired(options.provider, 'string', 'Provider is required.');
    const Key = this.parseRequired(options.key, 'string', 'Key is required.');
    const ContentType = this.parseOptional(options.contentType, 'string', mime.lookup(Key) || 'application/octet-stream');
    const expiresIn = this.parseOptional(options.expires, 'number', 300);
    const ACL = this.parseOptional(options.acl, 'string', undefined);
    const accessKeyId = this.parseRequired(options.accessKeyId, 'string', 'AccessKeyId is required.');
    const secretAccessKey = this.parseRequired(options.secretAccessKey, 'string', 'SecretAccessKey is required.');
    const region = this.parseOptional(options.region, 'string', 'us-east-1');
    let endpoint = `https://s3.${region}.amazonaws.com`;
    const forcePathStyle = this.parseOptional(options.forcePathStyle, 'boolean', false);
    let config = { endpoint: endpoint, credentials: { accessKeyId, secretAccessKey }, region, signatureVersion: 'v4', forcePathStyle: forcePathStyle };
    if (Provider === "custom" && options.endpoint != "" && options.endpoint != "undefined") {
        config.endpoint = options.endpoint;
    }
    const s3 = await getS3Object(options, this);
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
    let endpoint = `https://s3.${region}.amazonaws.com`;
    let config = { endpoint: endpoint, credentials: { accessKeyId, secretAccessKey }, region, signatureVersion: 'v4' };
    if (options.endpoint != "" && options.endpoint != "undefined") {
        config.endpoint = options.endpoint;
        config.forcePathStyle = true;
    }
    const s3 = await getS3Object(options, this);
    const command = new GetObjectCommand({ Bucket, Key });
    return getSignedUrl(s3, command, { expiresIn });
}

const getS3Object = async function (options, thisKeyword) {
    const accessKeyId = thisKeyword.parseRequired(options.accessKeyId, 'string', 'AccessKeyId is required.');
    const secretAccessKey = thisKeyword.parseRequired(options.secretAccessKey, 'string', 'SecretAccessKey is required.');
    const region = thisKeyword.parseOptional(options.region, 'string', 'us-east-1');
    const forcePathStyle = thisKeyword.parseOptional(options.forcePathStyle, 'boolean', false);
    let endpoint = `https://s3.${region}.amazonaws.com`;
    let config = { endpoint: endpoint, credentials: { accessKeyId, secretAccessKey }, region, signatureVersion: 'v4', forcePathStyle: forcePathStyle };
    if (options.provider === "custom" && options.endpoint != "" && options.endpoint != "undefined") {
        config.endpoint = options.endpoint;
    }
    return new S3(config);
}
