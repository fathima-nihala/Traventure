const ErrorHandler = require('../middleware/errorHandler');

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorHandler('Access denied. You must be an admin.', 403));
    }
    next(); 
};
