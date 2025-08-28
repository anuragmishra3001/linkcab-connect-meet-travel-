import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // The user who is giving the review
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewer ID is required']
  },
  // The user who is being reviewed
  revieweeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reviewee ID is required']
  },
  // The ride associated with this review
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: [true, 'Ride ID is required']
  },
  // Rating (1-5)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  // Optional review text
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  // Type of review (passenger reviewing host or host reviewing passenger)
  reviewType: {
    type: String,
    enum: ['passenger-to-host', 'host-to-passenger'],
    required: [true, 'Review type is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
reviewSchema.index({ reviewerId: 1, revieweeId: 1, rideId: 1 }, { unique: true });
reviewSchema.index({ revieweeId: 1 });
reviewSchema.index({ rideId: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;