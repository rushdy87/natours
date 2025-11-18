// @description: Factory functions to create CRUD handlers for Mongoose models
import { catchAsync } from './catch-async.js';
import AppError from './app-error.js';
import APIFeatures from './api-features.js';

// @description: Factory function to create a getAll handler for a given Mongoose model
// @param {Mongoose.Model} Model - The Mongoose model to perform the get operation on
// @returns {Function} - An Express middleware function to handle the get operation
// @usage: Used in route handlers to retrieve all documents from the database
const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Allow nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const docs = await features.query.explain();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

// @description: Factory function to create a getOne handler for a given Mongoose model
// @param {Mongoose.Model} Model - The Mongoose model to perform the get operation on
// @param {Object} popOptions - Options for population (optional)
// @returns {Function} - An Express middleware function to handle the get operation
// @usage: Used in route handlers to retrieve a single document from the database
const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No document found with ID: ${id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// @description: Factory function to create a create handler for a given Mongoose model
// @param {Mongoose.Model} Model - The Mongoose model to perform the create operation on
// @returns {Function} - An Express middleware function to handle the create operation
// @usage: Used in route handlers to create new documents in the database
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });

// @description: Factory function to create a delete handler for a given Mongoose model
// @param {Mongoose.Model} Model - The Mongoose model to perform the delete operation on
// @returns {Function} - An Express middleware function to handle the delete operation
// @usage: Used in route handlers to delete documents from the database
const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const deletedDoc = await Model.findByIdAndDelete(id);
    if (!deletedDoc) {
      return next(new AppError(`No document found with ID: ${id}`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

// @description: Factory function to create an update handler for a given Mongoose model
// @param {Mongoose.Model} Model - The Mongoose model to perform the update operation on
// @returns {Function} - An Express middleware function to handle the update operation
// @usage: Used in route handlers to update documents in the database
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const updatedDoc = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDoc) {
      return next(new AppError(`No document found with ID: ${id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: updatedDoc,
      },
    });
  });

export default { getAll, getOne, createOne, deleteOne, updateOne };

/* Notes about explain() in getAll:
 * explain() method provides detailed information about how MongoDB executes a query.
 * This can be useful for performance analysis and optimization.
 * In the getAll function, adding .explain() to the query helps in understanding the query execution plan.
 * This is particularly useful for complex queries involving filtering, sorting, field limiting, and pagination.
 * By analyzing the output of explain(), developers can identify potential bottlenecks and optimize their queries accordingly.
 ! However, in a production environment, it's common to remove explain() to avoid the overhead it introduces.
 */
/* Notes about indexing in MongoDB:
 * Indexes support the efficient execution of queries in MongoDB.
 * Without indexes, MongoDB must perform a collection scan, i.e., scan every document
 * in a collection, to select those documents that match the query statement.
 * This can be very inefficient and slow for large collections.
 * Proper indexing can significantly improve query performance.
 * It's important to analyze query patterns and create indexes that support those queries.
 * However, excessive indexing can lead to increased storage requirements and slower write
 * operations, so indexes should be used judiciously.
 */
