const Booking = require('../models/BookingModel');
const Package = require('../models/PackageModel');
const User = require('../models/AuthModel');
const catchAsyncError = require('../middleware/catchAsyncError');


// Create a new booking
exports.createBooking = catchAsyncError(async (req, res) => {
    try {
        const { packageId, selectedServices } = req.body;

        const packageData = await Package.findById(packageId);
        if (!packageData) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Start with base price
        let totalPrice = packageData.basePrice;

        const finalSelectedServices = {
            food: selectedServices?.food !== undefined ? selectedServices.food : packageData.includedServices.food,
            accommodation: selectedServices?.accommodation !== undefined ? selectedServices.accommodation : packageData.includedServices.accommodation
        };

        // Handle food pricing
        if (packageData.includedServices.food && !finalSelectedServices.food) {
            totalPrice -= packageData.foodPrice;
        } else if (!packageData.includedServices.food && finalSelectedServices.food) {
            totalPrice += packageData.foodPrice;
        }

        // Handle accommodation pricing
        if (packageData.includedServices.accommodation && !finalSelectedServices.accommodation) {
            totalPrice -= packageData.accommodationPrice;
        } else if (!packageData.includedServices.accommodation && finalSelectedServices.accommodation) {
            totalPrice += packageData.accommodationPrice;
        }

        // Create booking
        const newBooking = new Booking({
            package: packageId,
            user: req.user._id,
            selectedServices: finalSelectedServices,
            totalPrice
        });

        const savedBooking = await newBooking.save();

        const populatedBooking = await Booking.findById(savedBooking._id)
            .populate('package')
            .populate('user', 'name email');

        res.status(201).json(populatedBooking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
});


//get user booking
exports.getUserBookings = catchAsyncError(async (req, res) => {
    const { status } = req.query;
    const userId = req.user._id;

    const query = { user: userId };
    let bookings = await Booking.find(query)
        .populate('package')
        .sort({ bookingDate: -1 });

    if (status) {
        const today = new Date();
        bookings = bookings.filter(booking => {
            const pkg = booking.package;

             // Handle explicit status filtering
            if (['pending', 'accepted', 'cancelled'].includes(status)) {
                return booking.status === status;
            }
            
            if (status === 'completed') return pkg.endDate < today;
            if (status === 'active') return pkg.startDate <= today && today <= pkg.endDate;
            if (status === 'upcoming') return pkg.startDate > today;
            return true;
        });
    }

    res.status(200).json(bookings);
});


// Get all bookings (admin only)
exports.getAllBookings = catchAsyncError(async (req, res) => {

    try {
        const { status, userId, packageId } = req.query;
        const query = {};

        if (userId) query.user = userId;
        if (packageId) query.package = packageId;

        let bookings = await Booking.find(query)
            .populate('package')
            .populate('user', 'name email profilePicture')
            .sort({ bookingDate: -1 });

        if (status) {
            const today = new Date();
            bookings = bookings.filter(booking => {
                const pkg = booking.package;

                 if (['pending', 'accepted', 'cancelled'].includes(status)) {
                    return booking.status === status;
                }

                if (status === 'completed') return pkg.endDate < today;
                if (status === 'active') return pkg.startDate <= today && today <= pkg.endDate;
                if (status === 'upcoming') return pkg.startDate > today;
                return true;
            });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }

});


// Update booking status
exports.updateBookingStatus = catchAsyncError(async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

         // Validate status
        const validStatuses = ['pending', 'accepted', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        const updatedBooking = await Booking.findById(id)
            .populate('package')
            .populate('user', 'name email');

        res.status(200).json(updatedBooking);

    } catch (error) {
        res.status(500).json({ message: 'Failed to update booking', error: error.message });

    }
});

// Booking analytics (admin only)
// exports.getBookingAnalytics = catchAsyncError(async (req, res) => {
//     try {
//         const totalBookings = await Booking.countDocuments();

//         const today = new Date();
//         const packages = await Package.find();

//         let completed = 0, active = 0, upcoming = 0;
        

//         for (const pkg of packages) {
//             const count = await Booking.countDocuments({ package: pkg._id });
//             if (pkg.endDate < today) completed += count;
//             else if (pkg.startDate <= today && today <= pkg.endDate) active += count;
//             else upcoming += count;
//         }

//         const topUsers = await Booking.aggregate([
//             {
//                 $group: {
//                     _id: '$user',
//                     bookingsCount: { $sum: 1 },
//                     totalSpent: { $sum: '$totalPrice' }
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'userDetails'
//                 }
//             },
//             { $unwind: '$userDetails' },
//             {
//                 $project: {
//                     _id: 1,
//                     bookingsCount: 1,
//                     totalSpent: 1,
//                     name: '$userDetails.name',
//                     email: '$userDetails.email'
//                 }
//             },
//             { $sort: { bookingsCount: -1 } },
//             { $limit: 10 }
//         ]);

//         res.status(200).json({
//             totalBookings,
//             statusCounts: { completed, active, upcoming },
//             topUsers
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });

//     }

// });

// Booking analytics (admin only)
exports.getBookingAnalytics = catchAsyncError(async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();

        // Get status counts from the actual booking status field
        const statusCounts = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Initialize status counts
        let pending = 0, accepted = 0, cancelled = 0, completed = 0;
        
        // Map the aggregation results to variables
        statusCounts.forEach(status => {
            switch(status._id) {
                case 'pending':
                    pending = status.count;
                    break;
                case 'accepted':
                    accepted = status.count;
                    break;
                case 'cancelled':
                    cancelled = status.count;
                    break;
                case 'completed':
                    completed = status.count;
                    break;
            }
        });

        // Get date-based status counts (active, upcoming, completed based on package dates)
        const today = new Date();
        
        // Get all bookings with populated package data for date-based filtering
        const bookingsWithPackages = await Booking.find({ status: { $ne: 'cancelled' } })
            .populate('package', 'startDate endDate');

        let activeDateBased = 0, upcomingDateBased = 0, completedDateBased = 0;

        bookingsWithPackages.forEach(booking => {
            if (booking.package) {
                const packageStartDate = new Date(booking.package.startDate);
                const packageEndDate = new Date(booking.package.endDate);

                if (packageEndDate < today) {
                    completedDateBased++;
                } else if (packageStartDate <= today && today <= packageEndDate) {
                    activeDateBased++;
                } else if (packageStartDate > today) {
                    upcomingDateBased++;
                }
            }
        });

        // Get top users by booking count and total spent
        const topUsers = await Booking.aggregate([
            {
                $group: {
                    _id: '$user',
                    bookingsCount: { $sum: 1 },
                    totalSpent: { $sum: '$totalPrice' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    _id: 1,
                    bookingsCount: 1,
                    totalSpent: 1,
                    name: '$userDetails.name',
                    email: '$userDetails.email'
                }
            },
            { $sort: { bookingsCount: -1 } },
            { $limit: 10 }
        ]);

        // Calculate total revenue
        const revenueData = await Booking.aggregate([
            {
                $match: { status: { $ne: 'cancelled' } }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' }
                }
            }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // Get monthly booking trends (last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const monthlyTrends = await Booking.aggregate([
            {
                $match: {
                    bookingDate: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$bookingDate' },
                        month: { $month: '$bookingDate' }
                    },
                    bookingsCount: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.status(200).json({
            totalBookings,
            totalRevenue,
            statusCounts: {
                pending,
                accepted,
                cancelled,
                completed
            },
            dateBasedStatus: {
                active: activeDateBased,
                upcoming: upcomingDateBased,
                completed: completedDateBased
            },
            topUsers,
            monthlyTrends
        });

    } catch (error) {
        console.error('Get booking analytics error:', error);
        res.status(500).json({ 
            message: 'Failed to fetch analytics', 
            error: error.message 
        });
    }
});