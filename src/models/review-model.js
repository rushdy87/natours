import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
);

// Ensure one review per user per tour
reviewSchema.index({ user: 1, tour: 1 }, { unique: true }); // every combination of user and tour must be unique

reviewSchema.pre(/^find/, function (next) {
  // Skip population for findOneAnd operations to avoid conflicts
  if (this.op && this.op.includes('findOneAnd')) {
    return next();
  }

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    // Pipeline stages
    // 1. Match reviews for the given tourId
    {
      $match: { tour: tourId },
    },
    // 2. Group to calculate nRating and avgRating
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // the stats array will have either one element (with nRating and avgRating) or be empty
  // [{ _id: tourId, nRating: X, avgRating: Y }]  or  []

  if (stats.length > 0) {
    // mongoose.model('Tour') is equivalent to importing the Tour model and using it here
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne(); // Use clone() to create a separate query
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;

/* The problem with calculating average ratings on reviews is that 
when a review is updated or deleted using findOneAndUpdate or findOneAndDelete, 
the 'this' context in the post middleware does not refer to the document being modified, but refer to the query. 
To solve this, we use a pre middleware to fetch the document before the operation and 
store it in 'this.r'. Then, in the post middleware, we can access 'this.r' to get the tour ID 
and recalculate the average ratings accordingly.
 */
