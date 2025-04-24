const Package = require('../models/PackageModel');
const Booking = require('../models/BookingModel');
const ErrorHandler = require('../middleware/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const { deleteOldPackages } = require('../middleware/editFiles');

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
      return `${process.env.BACKEND_URL}/uploads/package/${file.filename}`;
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



// Get all packages with filters, sorting and status-based filtering
exports.getPackages = catchAsyncError(async (req, res, next) => {
  const {
    fromLocation,
    toLocation,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    status,
    page = 1,
    limit = 20,
  } = req.query;

  const query = {};

  if (fromLocation) {
    query.fromLocation = { $regex: new RegExp(fromLocation, 'i') };
  }
  if (toLocation) {
    query.toLocation = { $regex: new RegExp(toLocation, 'i') };
  }

  if (startDate) query.startDate = { $gte: new Date(startDate) };
  if (endDate) query.endDate = { ...query.endDate, $lte: new Date(endDate) };

  if (minPrice || maxPrice) {
    query.basePrice = {};
    if (minPrice) query.basePrice.$gte = Number(minPrice);
    if (maxPrice) query.basePrice.$lte = Number(maxPrice);
  }

  const today = new Date();
  if (status === 'completed') {
    query.endDate = { $lt: today };
  } else if (status === 'active') {
    query.startDate = { $lte: today };
    query.endDate = { $gte: today };
  } else if (status === 'upcoming') {
    query.startDate = { $gt: today };
  }

  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const packages = await Package.find(query)
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .populate('createdBy', 'name email') 
    .lean({ virtuals: true });

  res.status(200).json({
    success: true,
    count: packages.length,
    data: packages,
  });
});

//update packages
exports.updatePackage = catchAsyncError(async (req, res, next) => {
  const packageId = req.params.id;
  const updates = req.body;

  const packageToUpdate = await Package.findById(packageId);
  if (!packageToUpdate) {
    return next(new ErrorHandler('Package not found', 404));
  }

  if (updates.startDate && updates.endDate) {
    const startDate = new Date(updates.startDate);
    const endDate = new Date(updates.endDate);

    if (startDate >= endDate) {
      return next(new ErrorHandler('End date must be after start date', 400));
    }
  } else if (updates.startDate && new Date(updates.startDate) >= new Date(packageToUpdate.endDate)) {
    return next(new ErrorHandler('Start date must be before the existing end date', 400));
  } else if (updates.endDate && new Date(packageToUpdate.startDate) >= new Date(updates.endDate)) {
    return next(new ErrorHandler('End date must be after the existing start date', 400));
  }


  // if (req.files && req.files.length > 0) {
  //   console.log("Original image URLs:", packageToUpdate.images);
    
  //   for (const oldImage of packageToUpdate.images) {
  //     await deleteOldPackages(oldImage);
  //   }

  if (packageToUpdate.images && packageToUpdate.images.length > 0) {
    for (const oldImage of packageToUpdate.images) {
      await deleteOldPackages(oldImage);
    }
  
    updates.images = req.files.map(file => {
      return `${process.env.BACKEND_URL}/uploads/package/${file.filename}`;
    });
  } else {
    updates.images = packageToUpdate.images;
  }


  const updatedPackage = await Package.findByIdAndUpdate(packageId, {
    ...updates,
  }, { new: true });

  if (!updatedPackage) {
    return next(new ErrorHandler('Failed to update package', 500));
  }

  res.status(200).json({
    success: true,
    message: 'Package updated successfully',
    data: updatedPackage
  });
});