const express = require('express');
const router = express.Router();

const upload = require('../common/upload');

const File = require('../../models/File');

// const multer = require('multer');
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + '.png');
//   }
// });

// const upload = multer({ storage: storage }).single('profileImage');

// router.post('/', function(req, res) {
//   upload(req, res, function(err) {
//     if (err) {
//       // An error occurred when uploading
//     }
//     res.json({
//       success: true,
//       message: 'Image uploaded!'
//     });

//     // Everything went fine
//   });
// });

router.post('/image', function(req, res) {
  upload(req, res, error => {
    if (error) {
      res.status(400).send(error);
    } else {
      if (req.file == undefined) {
        res.status(400).send('Undefined xxx');
      } else {
        /**
         * Create new record in mongoDB
         */
        var fullPath = 'uploads/' + req.file.filename;

        var document = {
          path: fullPath,
          caption: req.body.caption
        };

        var photo = new File(document);
        photo
          .save()
          .then(photo => res.json(photo))
          .catch(err => res.send(err));
      }
    }
  });
});

/* GET home page. */
router.get('/', (req, res) => {
  File.find({}, ['path', 'caption'])
    .sort({ _id: -1 })
    .then(files => {
      if (!files) {
      }
      res.json(files);
    });
});

module.exports = router;
