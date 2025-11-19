import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import slugify from 'slugify';
// eslint-disable-next-line import/no-extraneous-dependencies
// import validator from 'validator';
// import User from './user-model.js';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // `this` only points to current doc on NEW document creation - not on update
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance optimization
tourSchema.index({ price: 1, ratingsAverage: -1 }); // Compound index on price (ascending) and ratingsAverage (descending)
tourSchema.index({ slug: 1 }); // Index on slug for faster queries

// Define virtual properties, indexes, middleware, or methods here if needed
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document Middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Populate guides before saving, this example of embedding user documents - commented out for reference
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query Middleware: runs before any find query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // this.start = Date.now();
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds`);
//   next();
// });

// Populate guides on find queries
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// Aggregate Middleware: runs before any aggregate query
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Model Middleware: Not commonly used, but can be defined similarly

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;

// Middleware is a fundamental concept in MongoDB and Mongoose that allows you to define functions that run at specific stages of the document lifecycle. These functions can be used to perform operations such as validation, transformation, or logging before or after certain events occur, such as saving a document or querying the database.
// There are four types of middlewares in mongoose:
// 1) Document Middlewares.
// 2) Query Middlewares.
// 3) Aggregate.
// 4) Model Middleware.
// Document middleware is used to define functions that run before or after certain document methods are executed, such as save(), validate(), remove(), and updateOne(). Document middleware functions have access to the document being processed and can modify its properties or perform additional operations before or after the method is executed.
// Example of a document middleware that runs before saving a document:
// tourSchema.pre('save', function (next) {
//   // 'this' refers to the document being saved
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
// In this example, the middleware function generates a slug from the tour name and assigns it to the slug property of the document before it is saved to the database.
