import { Router } from 'express';

import tourControllers from '../controllers/tour-controllers.js';

const router = Router();

router.route('/tour-stats').get(tourControllers.getTourStats);
router.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTourById)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

export default router;
