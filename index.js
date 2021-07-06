const express = require('express');
const fileUpload = require('express-fileupload');
const uuidv4 = require('uuid').v4;
const path = require('path');
const { createNestedDirectory, deleteDirectory } = require('./helpers');

const app = express();
app.use(fileUpload());

const port = 5162;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/upload', (req, res, next) => {
  if (req.files) {
    const file = req.files.image;
    const fileName = file.name;
    const dirPath = createNestedDirectory(['storage', uuidv4()]);
    const originPath = path.join(dirPath, fileName);
    file.mv(originPath, err => {
      if (err) {
        res.json({
          error: true,
          msg: err.message
        });
      } else {
        res.json({
          msg: 'Uploaded successfully'
        });
      }
    });
  } else {
    res.json({
      error: true,
      msg: 'There is no file'
    });
  }
});
