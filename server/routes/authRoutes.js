const router = require('express').Router();
const { register, login, googleLogin, getCurrentUser, getAllClients, updateProfile } = require('../controllers/AuthController');
const { isAdmin } = require('../middleware/isAdmin');
const { isAuthenticated } = require('../middleware/isAuthenticated');
const { upload } = require('../middleware/multer');


router.route('/reg').post(upload.none(), register);
router.route('/login').post(login);
router.route('/g-login').post(googleLogin);
router.route('/me').get(isAuthenticated, getCurrentUser);
router.route('/profile').put(isAuthenticated, upload.single('profilePicture'), updateProfile);
router.route('/clients').get(isAuthenticated, isAdmin, getAllClients);


module.exports = router;