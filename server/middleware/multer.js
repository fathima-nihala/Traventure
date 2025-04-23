const multer = require('multer');
const path = require('path');
// const fs = require('fs');

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
      fileSize: 1024 * 1024 * 20 // 20MB file size limit
    },
    fileFilter: fileFilter
  });


  module.exports = { upload } ; 