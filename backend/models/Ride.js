import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: [true, 'Latitude is required']
  },
  lng: {
    type: Number,
    required: [true, 'Longitude is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  }
}, { _id: false });

const rideSchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host is required']
  },
  startLocation: {
    type: locationSchema,
    required: [true, 'Start location is required']
  },
  endLocation: {
    type: locationSchema,
    required: [true, 'End location is required']
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time are required']
  },
  seats: {
    type: Number,
    required: [true, 'Number of seats is required'],
    min: [1, 'At least 1 seat is required'],
    max: [10, 'Maximum 10 seats allowed']
  },
  pricePerSeat: {
    type: Number,
    required: [true, 'Price per seat is required'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  vehicle: {
    type: {
      type: String,
      required: [true, 'Vehicle type is required']
    },
    color: String,
    year: String
  },
  preferences: {
    genderPreference: {
      type: String,
      enum: ['any', 'male', 'female'],
      default: 'any'
    },
    smoking: {
      type: Boolean,
      default: false
    },
    pets: {
      type: Boolean,
      default: false
    },
    music: {
      type: Boolean,
      default: true
    }
  },
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seats: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
rideSchema.index({ 'startLocation.address': 1, 'endLocation.address': 1, dateTime: 1 });
rideSchema.index({ hostId: 1 });
rideSchema.index({ 'passengers.user': 1 });
rideSchema.index({ status: 1 });
rideSchema.index({ 'preferences.genderPreference': 1 });

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;