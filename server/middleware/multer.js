const multer = require('multer');
const path = require('path');
// const fs = require('fs');


//user 
const storage = multer.diskStorage({
    destination: function(req, file, cb ){
        cb(null, path.join(__dirname, '..', 'upload'));
    },
    filename: function(req, file, cb){
        let name = file.originalname.replace(/\s\s+/g, ' ');
        name = name.replace(/[&\/\\#, +()$~%'":=*?<>{}@-]/g, '_');
        cb(null, Date.now() + "_" + name)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/svg+xml',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'image/avif',
    ];
  
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 20 
    },
    fileFilter: fileFilter
  });

  //packages
const packageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/package/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0].replaceAll(" ", "_").slice(0, 10) + Date.now() + path.extname(file.originalname));
  }
});

const packageUpload = multer({
  storage: packageStorage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
})

  module.exports = { upload, packageUpload } ; 