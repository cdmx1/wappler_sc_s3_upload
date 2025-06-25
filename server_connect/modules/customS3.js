const fs = require('fs-extra');
const { S3 } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const path = require('path');

exports.s3_signed_upload = async function (options) {
    const Bucket = this.parseRequired(options.bucket, 'string', 'Bucket is required.');
    const Provider = this.parseOptional(options.provider, 'string', 'aws');
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

exports.s3_signed_download = async function (options) {
    const Bucket = this.parseRequired(options.bucket, 'string', 'Bucket is required.');
    const Provider = this.parseOptional(options.provider, 'string', 'aws');
    const Key = this.parseRequired(options.key, 'string', 'Key is required.');
    const expiresIn = this.parseOptional(options.expires, 'number', 300);
    const accessKeyId = this.parseRequired(options.accessKeyId, 'string', 'AccessKeyId is required.');
    const secretAccessKey = this.parseRequired(options.secretAccessKey, 'string', 'SecretAccessKey is required.');
    const region = this.parseOptional(options.region, 'string', 'us-east-1');
    let endpoint = `https://s3.${region}.amazonaws.com`;
    const forcePathStyle = this.parseOptional(options.forcePathStyle, 'boolean', false);
    let config = { endpoint: endpoint, credentials: { accessKeyId, secretAccessKey }, region, signatureVersion: 'v4', forcePathStyle: forcePathStyle };
    if (Provider === "custom", options.endpoint != "" && options.endpoint != "undefined") {
        config.endpoint = options.endpoint;
    }
    const s3 = await getS3Object(options, this);
    const command = new GetObjectCommand({ Bucket, Key });
    return getSignedUrl(s3, command, { expiresIn });
}

exports.s3_put_object = async function (options) {
    const File = this.parseRequired(options.file, 'string', 'File input name is required.');
    const Bucket = this.parseRequired(options.bucket, 'string', 'Bucket is required.');
    const Provider = this.parseOptional(options.provider, 'string', 'aws');
    const Key = this.parseRequired(options.key, 'string', 'Key is required.');
    const ContentType = this.parseOptional(options.contentType, 'string', mime.lookup(Key) || 'application/octet-stream');
    const ACL = this.parseOptional(options.acl, 'string', undefined);
    const accessKeyId = this.parseRequired(options.accessKeyId, 'string', 'AccessKeyId is required.');
    const secretAccessKey = this.parseRequired(options.secretAccessKey, 'string', 'SecretAccessKey is required.');
    const region = this.parseOptional(options.region, 'string', 'us-east-1');
    const ContentDisposition = this.parseOptional(options.contentDisposition, 'string', undefined);
    const endpoint = `https://s3.${region}.amazonaws.com`;
    const forcePathStyle = this.parseOptional(options.forcePathStyle, 'boolean', false);
    const useFilePath = this.parseOptional(options.useFilePath, 'boolean', false);
    let config = { endpoint: endpoint, credentials: { accessKeyId, secretAccessKey }, region, signatureVersion: 'v4', forcePathStyle: forcePathStyle };
    if (Provider === "custom" && options.endpoint != "" && options.endpoint != "undefined") {
        config.endpoint = options.endpoint;
    }
    const s3 = await getS3Object(options, this);

    if (!s3) throw new Error(`S3 provider "${provider}" doesn't exist.`);

    let filePath = path.join(process.cwd(), File); //File;

    if (!useFilePath) {
        const ReqFile = this.req.files[File];
        filePath = ReqFile.tempFilePath;
    }


    let Body = fs.createReadStream(filePath);


    const command = new PutObjectCommand({ Bucket, Key, ContentType, ACL, ContentDisposition, Body });
    try {

        let result = await s3.send(command);
        let url;
        if (forcePathStyle || Provider === "custom") {
            // path-style or custom endpoint: https://endpoint/bucket/key
            url = `${endpoint.replace(/\/$/, '')}/${Bucket}/${encodeURIComponent(Key)}`;
        } else {
            // virtual-hosted–style: https://bucket.s3.region.amazonaws.com/key
            url = `https://${Bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(Key)}`;
        }

        return {
            ...result,
            url,
            bucket: Bucket,
            key: Key
        };
    } catch (error) {
        throw new Error(`Failed to upload file to S3: ${error}`);
    }
}

exports.s3_put_objects = async function (options) {
    const Files = this.parseRequired(options.files, 'array', 'Files input array is required.');
    const Bucket = this.parseRequired(options.bucket, 'string', 'Bucket is required.');
    const Provider = this.parseOptional(options.provider, 'string', 'aws');
    const baseKey = this.parseOptional(options.baseKey, 'string', '');
    const keyPattern = this.parseOptional(options.keyPattern, 'string', 'filename');
    const ACL = this.parseOptional(options.acl, 'string', undefined);
    const accessKeyId = this.parseRequired(options.accessKeyId, 'string', 'AccessKeyId is required.');
    const secretAccessKey = this.parseRequired(options.secretAccessKey, 'string', 'SecretAccessKey is required.');
    const region = this.parseOptional(options.region, 'string', 'us-east-1');
    const endpoint = `https://s3.${region}.amazonaws.com`;
    const forcePathStyle = this.parseOptional(options.forcePathStyle, 'boolean', false);
    const useFilePath = this.parseOptional(options.useFilePath, 'boolean', false);

    let config = { endpoint: endpoint, credentials: { accessKeyId, secretAccessKey }, region, signatureVersion: 'v4', forcePathStyle: forcePathStyle };
    if (Provider === "custom" && options.endpoint != "" && options.endpoint != "undefined") {
        config.endpoint = options.endpoint;
    }

    const s3 = await getS3Object(options, this);
    if (!s3) throw new Error(`S3 provider "${Provider}" doesn't exist.`);

    try {
        let counter = 0;
        const timestamp = Date.now();

        const uploadResults = await Promise.all(Files.map(async (fileInfo) => {
            let Key;
            const filename = path.basename(fileInfo.file);

            // Generate key based on pattern
            switch(keyPattern) {
                case 'increment':
                    counter++;
                    Key = `${baseKey}${counter}`;
                    break;
                case 'timestamp':
                    Key = `${baseKey}${timestamp}`;
                    break;
                case 'filename':
                default:
                    Key = `${baseKey}${filename}`;
            }

            // Ensure no double slashes in key
            Key = Key.replace(/\/+/g, '/');
            // Remove leading slash if present
            Key = Key.replace(/^\//, '');

            const ContentType = fileInfo.contentType || mime.lookup(Key) || 'application/octet-stream';
            const ContentDisposition = fileInfo.contentDisposition;

            let filePath = useFilePath ? path.join(process.cwd(), fileInfo.file) : this.req.files[fileInfo.file].tempFilePath;
            let Body = fs.createReadStream(filePath);

            const command = new PutObjectCommand({
                Bucket,
                Key,
                ContentType,
                ACL,
                ContentDisposition,
                Body
            });

            const result = await s3.send(command);

            let url;
            if (forcePathStyle || Provider === "custom") {
                url = `${endpoint.replace(/\/$/, '')}/${Bucket}/${encodeURIComponent(Key)}`;
            } else {
                url = `https://${Bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(Key)}`;
            }

            return {
                ...result,
                url,
                bucket: Bucket,
                key: Key,
                originalFile: fileInfo.file
            };
        }));

        return {
            success: true,
            results: uploadResults
        };
    } catch (error) {
        throw new Error(`Failed to upload files to S3: ${error}`);
    }
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
