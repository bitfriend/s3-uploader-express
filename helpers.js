const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const resizeAndUploadToS3 = (srcPath, dstPath, width, height) => new Promise((resolve, reject) => {
  sharp(srcPath).resize(width, height).toFile(dstPath, async (err, info) => {
    if (err) {
      console.log(err);
      return reject(err);
    }
    resolve(dstPath);
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
