const router = require('express').Router();
const { createBooking } = require('../controllers/BookingController');
const { isAuthenticated } = require('../middleware/isAuthenticated');


router.route('/').post(isAuthenticated, createBooking);


module.exports = router;
