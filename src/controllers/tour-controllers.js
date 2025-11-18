import Tour from '../models/tour-model.js';
import { catchAsync } from '../utils/catch-async.js';
import factory from '../utils/handler-factory.js';

const getAllTours = factory.getAll(Tour);

const getTourById = factory.getOne(Tour, { path: 'reviews' });

const createTour = factory.createOne(Tour);

const updateTour = factory.updateOne(Tour);

const deleteTour = factory.deleteOne(Tour);

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      // Stage 1: Filtering
      $match: { ratingAverage: { $gte: 4.5 } }, // $match is used to filter documents, similar to the find() method
      //* $match is used to filter documents, similar to the find() method
    },
    {
      // Stage 2: Grouping
      $group: {
        //* $group is used to group documents by a specified identifier, similar to SQL's GROUP BY clause
        // _id: null, // null here means we are not grouping by any specific field, so we get overall stats
        _id: { $toUpper: '$difficulty' }, // Grouping by difficulty level
        numTours: { $sum: 1 }, // Count total tours, each document adds 1
        numRatings: { $sum: '$ratingsQuantity' }, // Count total ratings
        avgRating: { $avg: '$ratingAverage' }, // Calculate average rating
        avgPrice: { $avg: '$price' }, // Calculate average price
        minPrice: { $min: '$price' }, // Calculate minimum price
        maxPrice: { $max: '$price' }, // Calculate maximum price
      },
    },
    {
      // Stage 3: Sorting
      $sort: { avgPrice: 1 }, // Sort by average price in ascending order, 1 for ascending, -1 for descending
    },
    // {
    //   // Stage 4: Filtering out 'EASY' difficulty tours
    //   $match: { _id: { $ne: 'EASY' } }, // Exclude groups where _id (difficulty) is 'EASY'
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // e.g., 2023

  const plan = await Tour.aggregate([
    {
      // Stage 1: Unwind startDates array
      $unwind: '$startDates', // Deconstructs the startDates array field from the input documents to output a document for each element
    },
    {
      // Stage 2: Filter by year
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      // Stage 3: Group by month
      $group: {
        _id: { $month: '$startDates' }, // Group by month of the startDates
        numTourStarts: { $sum: 1 }, // Count number of tour starts
        tours: { $push: '$name' }, // Push tour names into an array
      },
    },
    {
      // Stage 4: Add month field
      $addFields: { month: '$_id' }, // Add a new field 'month' with the value of _id
    },
    {
      // Stage 5: Project to exclude _id
      $project: {
        _id: 0, // Exclude the _id field from the output
      },
    },
    {
      // Stage 6: Sort by number of tour starts
      $sort: { numTourStarts: -1 }, // Sort by numTourStarts in descending order
    },
    {
      // Stage 7: Limit to 12 results
      $limit: 12, // Limit the results to 12 documents
    },
  ]);

  res.status(200).json({
    status: 'success',
    year,
    data: {
      plan,
    },
  });
});

export default {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
