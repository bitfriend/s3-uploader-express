const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const uuidv4 = require('uuid').v4;
const path = require('path');
const { createNestedDirectory, resizeAndUploadToS3 } = require('./helpers');

const app = express();

const port = 5162;

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
server.headersTimeout = 7200000; // avoid ERR_CONNECTION_ABORTED

app.use(cors());
app.use(fileUpload());

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message || 'Internal server error'
    }
  });
  next(err);
});

app.post('/upload', async (req, res, next) => {
  if (req.files) {
    const file = req.files.image;
    const fileName = file.name;
    const dirPath = createNestedDirectory(['storage', uuidv4()]);
    const originPath = path.join(dirPath, fileName);
    file.mv(originPath, err => {
      if (err) {
        throw err;
      } else {
        const largeName = path.basename(fileName) + '-large' + path.extname(fileName);
        const mediumName = path.basename(fileName) + '-medium' + path.extname(fileName);
        const thumbName = path.basename(fileName) + '-thumb' + path.extname(fileName);
        const p1 = resizeAndUploadToS3(originPath, path.join(dirPath, largeName), 2048, 2048);
        const p2 = resizeAndUploadToS3(originPath, path.join(dirPath, mediumName), 1024, 1024);
        const p3 = resizeAndUploadToS3(originPath, path.join(dirPath, thumbName), 300, 300);
        Promise.all([p1, p2, p3]).then(([large, medium, thumb]) => {
          res.json({ large, medium, thumb });
        }).catch(e => {
          throw e;
        });
      }
    });
  } else {
    const err = new Error('There is no file');
    err.status = 400;
    throw err;
  }
});
