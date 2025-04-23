const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  selectedServices: {
    food: {
      type: Boolean,
      default: false,
    },
    accommodation: {
      type: Boolean,
      default: false,
    },
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'cancelled', 'completed'],
    default: 'accepted', // As per requirements, bookings are automatically accepted
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Virtual field to get status based on package dates
bookingSchema.virtual('bookingStatus').get(function() {
  if (!this._package) return this.status;
  
  const today = new Date();
  if (this._package.endDate < today) {
    return 'completed';
  } else if (this._package.startDate <= today && today <= this._package.endDate) {
    return 'active';
  } else {
    return 'upcoming';
  }
});

// Ensure virtuals are included in JSON output
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;