const Package = require('../models/PackageModel');
const Booking = require('../models/BookingModel');
const ErrorHandler = require('../middleware/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const { deleteOldPackages } = require('../middleware/editFiles');
const errorHandler = require('../middleware/errorHandler');
const {deletePackageImages} = require('../middleware/deleteFiles')

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


//delete package(admin only)
exports.deletePackage = catchAsyncError(async (req, res, next) => {
  const packageId = req.params.id;

  const packageToDelete = await Package.findById(packageId);
  if (!packageToDelete) {
    return next(new errorHandler('Package not found', 404));
  }

  const bookingsCount = await Booking.countDocuments({ package: packageId });
  if (bookingsCount > 0) {
    return next(new errorHandler('Cannot delete package with existing bookings', 400));
  }


  if (packageToDelete.images && Array.isArray(packageToDelete.images) && packageToDelete.images.length > 0) {
    console.log('Deleting package images:', packageToDelete.images);
    await deletePackageImages(packageToDelete.images);
  } else {
    console.log('No images to delete for package:', packageId);
  }

  await Package.findByIdAndDelete(packageId);
  res.status(200).json({ message: 'Package deleted successfully' });
});


// Get package by ID
exports.getPackageById = catchAsyncError(async (req, res, next) => {
  const packageId = req.params.id;

  const packageData = await Package.findById(packageId).populate('createdBy', 'name email');

  if (!packageData) {
    return next(new errorHandler('Package not found', 404));
  }

  res.status(200).json(packageData);
});




// Get package analytics (admin only)
exports.getPackageAnalytics = catchAsyncError(async (req, res, next) => {
  const today = new Date();

  // 1. Count packages by status
  const packagesCount = await Package.aggregate([
    {
      $addFields: {
        status: {
          $cond: {
            if: { $lt: ['$endDate', today] },
            then: 'completed',
            else: {
              $cond: {
                if: {
                  $and: [
                    { $lte: ['$startDate', today] },
                    { $gte: ['$endDate', today] }
                  ]
                },
                then: 'active',
                else: 'upcoming'
              }
            }
          }
        }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // 2. Count bookings per package and join package details
  const bookingsPerPackage = await Booking.aggregate([
    {
      $group: {
        _id: '$package',
        bookingsCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'packages', //  lowercase 
        localField: '_id',
        foreignField: '_id',
        as: 'packageDetails'
      }
    },
    { $unwind: '$packageDetails' },
    {
      $project: {
        _id: 1,
        bookingsCount: 1,
        packageName: '$packageDetails.fromLocation',
        toLocation: '$packageDetails.toLocation',
        startDate: '$packageDetails.startDate',
        endDate: '$packageDetails.endDate'
      }
    },
    { $sort: { bookingsCount: -1 } }
  ]);

  res.status(200).json({
    success: true,
    packagesCount,
    bookingsPerPackage
  });
});