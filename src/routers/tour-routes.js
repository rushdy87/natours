import { Router } from "express";

import {
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
} from "../controllers/tour-controllers.js";

const router = Router();

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTourById).patch(updateTour).delete(deleteTour);

export default router;
