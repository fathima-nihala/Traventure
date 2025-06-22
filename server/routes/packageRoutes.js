const router = require('express').Router();
const { createPackage, getPackages, updatePackage, deletePackage, getPackageById, getPackageAnalytics } = require('../controllers/PackageController');
const { isAdmin } = require('../middleware/isAdmin');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { packageUpload } = require('../middleware/multer');


router.route('/create').post(isAuthenticated, isAdmin, packageUpload.array('images',5), createPackage);
router.route('/analytics').get(isAuthenticated, isAdmin, getPackageAnalytics);
router.route('/').get(getPackages);
router.route('/:id').put(isAuthenticated, isAdmin, packageUpload.array('images',5), updatePackage);
router.route('/:id').delete(isAuthenticated, isAdmin, deletePackage);
router.route('/:id').get(isAuthenticated, getPackageById);

module.exports = router;
