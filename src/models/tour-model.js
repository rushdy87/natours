import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
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
    },
    ratingAverage: {
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
    priceDiscount: Number,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Define virtual properties, indexes, middleware, or methods here if needed
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;

// Middleware is a fundamental concept in MongoDB and Mongoose that allows you to define functions that run at specific stages of the document lifecycle. These functions can be used to perform operations such as validation, transformation, or logging before or after certain events occur, such as saving a document or querying the database.
// There are four types of middlewares in mongoose:
// 1) Document.
// 2) Query.
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
