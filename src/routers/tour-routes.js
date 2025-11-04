import { Router } from 'express';

import tourControllers from '../controllers/tour-controllers.js';

const router = Router();

router.param('id', tourControllers.checkId);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.checkBody, tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTourById)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

export default router;
