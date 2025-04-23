const Package = require('../models/PackageModel');
const Booking = require('../models/BookingModel');
const ErrorHandler = require('../middleware/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');

//create package
exports.createPackage = catchAsyncError(async (req, res, next) => {
  try {
    const {
      fromLocation,
      toLocation,
      startDate,
      endDate,
      basePrice,
      includedServices,
      foodPrice,
      accommodationPrice,
      description
    } = req.body;

    if (new Date(startDate) >= new Date(endDate)) {
      return next(new ErrorHandler('End date must be after start date', 400));
    }

    // Construct image URLs
    const imageUrls = req.files?.map(file => {
      return `${process.env.BACKEND_URL}/uploads/${file.filename}`;
    }) || [];

    const newPackage = new Package({
      fromLocation,
      toLocation,
      startDate,
      endDate,
      basePrice,
      includedServices: includedServices ? JSON.parse(includedServices) : { food: false, accommodation: false },
      foodPrice: foodPrice || 0,
      accommodationPrice: accommodationPrice || 0,
      description,
      images: imageUrls,
      createdBy: req.user._id
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    next(new ErrorHandler(error.message || 'Something went wrong', 500));
  }
});
