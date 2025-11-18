import { Router } from 'express';

import tourControllers from '../controllers/tour-controllers.js';

import reviewRouter from './review-routes.js';

const { protect, restrictTo } = await import(
  '../middlewares/authorization-middlewares.js'
);

const router = Router();

// Nested route for reviews
router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(tourControllers.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    protect,
    restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan,
  );

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTourById)
  .patch(protect, restrictTo('admin', 'lead-guide'), tourControllers.updateTour)
  .delete(
    protect,
    restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour,
  );

// In reality, this don't belong here. They should be in review-routes.js, and the
// review-routes.js should be mounted on /tours/:tourId/reviews
// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), reviewControllers.createReview);

export default router;
