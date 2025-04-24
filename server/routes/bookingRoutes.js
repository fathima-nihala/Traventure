const router = require('express').Router();
const { createBooking, getUserBookings, getAllBookings, updateBookingStatus, getBookingAnalytics } = require('../controllers/BookingController');
const { isAdmin } = require('../middleware/isAdmin');
const { isAuthenticated } = require('../middleware/isAuthenticated');


router.route('/').post(isAuthenticated, createBooking);
router.route('/package').get(isAuthenticated, isAdmin, getAllBookings);
router.route('/').get(isAuthenticated, getUserBookings);
router.route('/:id').put(isAuthenticated, updateBookingStatus);
router.route('/analytics').get(isAuthenticated, getBookingAnalytics);


module.exports = router;
