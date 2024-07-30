const aws = require('aws-sdk');
const env = require('./env.config');

if (!env.SECRET_KEY && !env.ACCESSKEYID) return module.exports = null;

aws.config.update({
    secretAccessKey: env.SECRET_KEY,
    accessKeyId: env.ACCESSKEYID,
    region: env.REGION,
});

const s3 = new aws.S3();

module.exports = s3;