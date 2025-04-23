const router = require('express').Router();
const { createPackage } = require('../controllers/PackageController');
const { isAdmin } = require('../middleware/isAdmin');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { packageUpload } = require('../middleware/multer');


router.route('/create').post(isAuthenticated, isAdmin, packageUpload.array('images',5), createPackage);

module.exports = router;
