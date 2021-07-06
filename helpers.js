const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid').v4;

const credential = require('./credential.json');

AWS.config.update({
  secretAccessKey: credential.S3_ACCESS_SECRET,
  accessKeyId: credential.S3_ACCESS_KEY,
  region: 'us-east-2',
  signatureVersion: 'v4'
});

const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const resizeAndUploadToS3 = (srcPath, dstPath, width, height) => new Promise((resolve, reject) => {
  sharp(srcPath).resize(width, height).toFile(dstPath, async (err, info) => {
    if (err) {
      console.log(err);
      return reject(err);
    }
    try {
      const fileContent = await fs.promises.readFile(dstPath);
      const result = await s3.upload({
        Bucket: 'buying-labs-image-uploader',
        Key: uuidv4() + path.extname(dstPath),
        Body: fileContent
      }).promise();
      resolve(result.Location);
    } catch (e) {
      reject(e);
    }
  });
})

module.exports = {
  createNestedDirectory: (dirs) => {
    let dirPath = __dirname;
    for (const dir of dirs) {
      dirPath = path.join(dirPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
    }
    return dirPath;
  },
  deleteDirectory: (subDir) => {
    const dirPath = path.join(__dirname, subDir);
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath, {
        recursive: true
      });
    }
  },
  resizeAndUploadToS3
}
