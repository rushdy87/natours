import { Router } from 'express';
import {
  createReview,
  getAllReviews,
} from '../controllers/review-controllers.js';
import {
  protect,
  restrictTo,
} from '../middlewares/authorization-middlewares.js';

const router = Router();

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

export default router;
