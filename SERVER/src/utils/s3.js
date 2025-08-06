const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.uploadToS3 = async (file) => {
  const fileExt = path.extname(file.originalname);
  const Key = `notice-images/${uuid()}${fileExt}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.upload(params).promise();

  return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
};

exports.deleteFromS3 = async (imageUrl) => {
  const urlParts = imageUrl.split('/');
  const Key = urlParts.slice(3).join('/'); // gets everything after bucket name

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key,
  };

  await s3.deleteObject(params).promise();
};
