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