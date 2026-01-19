const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: [true, 'Bus ID is required'],
    unique: true,
    trim: true
  },
  busName: {
    type: String,
    required: [true, 'Bus name is required'],
    trim: true
  },
  routeId: {
    type: String,
    required: [true, 'Route ID is required'],
    trim: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Driver ID is required']
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bus', busSchema);
