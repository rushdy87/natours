import { Router } from 'express';

import tourControllers from '../controllers/tour-controllers.js';
import reviewControllers from '../controllers/review-controllers.js';

const { protect, restrictTo } = await import(
  '../middlewares/authorization-middlewares.js'
);

const router = Router();

router.route('/tour-stats').get(tourControllers.getTourStats);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

router
  .route('/')
  .get(protect, tourControllers.getAllTours)
  .post(tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTourById)
  .patch(tourControllers.updateTour)
  .delete(
    protect,
    restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour,
  );

router
  .route('/:tourId/reviews')
  .post(protect, restrictTo('user'), reviewControllers.createReview);

export default router;
