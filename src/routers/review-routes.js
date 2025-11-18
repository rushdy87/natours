import { Router } from 'express';
import reviewControllers from '../controllers/review-controllers.js';
import {
  protect,
  restrictTo,
} from '../middlewares/authorization-middlewares.js';
import { setUserAndTourIds } from '../middlewares/review-middlewares.js';

// mergeParams to access params from parent router, i.e., tourId
const router = Router({ mergeParams: true });
// The magic of mergeParams: now we can access req.params.tourId, even though
// this router is mounted on /reviews, not /tours/:tourId/reviews

router.use(protect);

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(restrictTo('user'), setUserAndTourIds, reviewControllers.createReview);

router
  .route('/:id')
  .get(reviewControllers.getReviewById)
  .patch(restrictTo('user', 'admin'), reviewControllers.updateReview)
  .delete(restrictTo('user', 'admin'), reviewControllers.deleteReview);

export default router;
