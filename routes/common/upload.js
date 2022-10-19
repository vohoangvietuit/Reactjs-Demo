const multer = require('multer');
const path = require('path');

// configuring Multer to use files directory for storing files
// this is important because later we'll need to access file path

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + '.png');
//   }
// });

const storageEngine = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, fn) {
    fn(
      null,
      new Date().getTime().toString() +
        '-' +
        file.fieldname +
        path.extname(file.originalname)
    );
  }
});

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: function(req, file, callback) {
    validateFile(file, callback);
  }
}).single('photo');

var validateFile = function(file, cb) {
  allowedFileTypes = /jpeg|jpg|png|gif/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFileTypes.test(file.mimetype);
  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb('Invalid file type. Only JPEG, PNG and GIF file are allowed.');
  }
};

module.exports = upload;
