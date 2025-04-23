const router = require('express').Router();
const { createPackage, getPackages, updatePackage } = require('../controllers/PackageController');
const { isAdmin } = require('../middleware/isAdmin');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { packageUpload } = require('../middleware/multer');


router.route('/create').post(isAuthenticated, isAdmin, packageUpload.array('images',5), createPackage);
router.route('/').get(isAuthenticated, getPackages);
router.route('/:id').put(isAuthenticated, isAdmin, packageUpload.array('images',5), updatePackage);



module.exports = router;
