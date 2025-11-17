import { Router } from 'express';
import reviewControllers from '../controllers/review-controllers.js';
import {
  protect,
  restrictTo,
} from '../middlewares/authorization-middlewares.js';

const router = Router();

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(protect, restrictTo('user'), reviewControllers.createReview);

export default router;
