const path = require('path');
const fs = require('fs');

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
  }
}
