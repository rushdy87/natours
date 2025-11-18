import { Router } from 'express';
import reviewControllers from '../controllers/review-controllers.js';
import {
  protect,
  restrictTo,
} from '../middlewares/authorization-middlewares.js';

// mergeParams to access params from parent router, i.e., tourId
const router = Router({ mergeParams: true });
// The magic of mergeParams: now we can access req.params.tourId, even though
// this router is mounted on /reviews, not /tours/:tourId/reviews

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(protect, restrictTo('user'), reviewControllers.createReview);

export default router;
