import Review from '../models/review-model.js';
import factory from '../utils/handler-factory.js';

const getAllReviews = factory.getAll(Review);

const getReviewById = factory.getOne(Review);

const createReview = factory.createOne(Review);

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

export default {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
