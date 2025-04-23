const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  fromLocation: {
    type: String,
    required: true,
  },
  toLocation: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  includedServices: {
    food: {
      type: Boolean,
      default: false,
    },
    accommodation: {
      type: Boolean,
      default: false,
    },
  },
  foodPrice: {
    type: Number,
    default: 0,
  },
  accommodationPrice: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Virtual field to get status based on current date
packageSchema.virtual('status').get(function() {
  const today = new Date();
  if (this.endDate < today) {
    return 'completed';
  } else if (this.startDate <= today && today <= this.endDate) {
    return 'active';
  } else {
    return 'upcoming';
  }
});

// Ensure virtuals are included in JSON output
packageSchema.set('toJSON', { virtuals: true });
packageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Package', packageSchema);